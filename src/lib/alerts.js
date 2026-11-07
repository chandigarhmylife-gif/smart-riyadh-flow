// Turns simulation state into operator alerts (queue build-up, spillback,
// incidents, emergency pre-emption). Pure helpers, so the rules are testable.

/**
 * Queue alerts with hysteresis: a queue alert opens when a queue reaches
 * `high` and closes only once it falls to `clear` or below, so alerts don't
 * flicker around the threshold.
 *
 * active: Set of keys currently in alert. queues: { key: vehicles }.
 * Returns { active, events } where events are { kind, key, value }.
 */
export function updateQueueAlerts(active, queues, { high = 15, clear = 5 } = {}) {
  const next = new Set(active);
  const events = [];
  for (const [key, value] of Object.entries(queues)) {
    if (!next.has(key) && value >= high) {
      next.add(key);
      events.push({ kind: 'queue-high', key, value });
    } else if (next.has(key) && value <= clear) {
      next.delete(key);
      events.push({ kind: 'queue-cleared', key, value });
    }
  }
  return { active: next, events };
}

export function formatSimTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Display text for an alert event. `describe(key)` turns a queue key into a
 * place name, e.g. "north approach" or "King Fahd / Tahlia, north approach".
 */
export function alertMessage(event, describe = (k) => k) {
  switch (event.kind) {
    case 'queue-high':
      return { type: 'warning', title: 'Queue building', message: `${cap(describe(event.key))}: ${event.value} vehicles waiting.` };
    case 'queue-cleared':
      return { type: 'success', title: 'Queue cleared', message: `${cap(describe(event.key))} is back to ${event.value} vehicle(s).` };
    case 'spillback':
      return { type: 'warning', title: 'Queue spillback', message: `Queue from ${event.toName} has backed up to ${event.fromName}; vehicles there are blocked.` };
    case 'spillback-cleared':
      return { type: 'success', title: 'Spillback cleared', message: `Traffic is moving again from ${event.fromName} to ${event.toName}.` };
    case 'incident':
      return { type: 'warning', title: 'Incident', message: `Capacity reduced at ${event.name}.` };
    case 'incident-cleared':
      return { type: 'success', title: 'Incident cleared', message: `${event.name} is back to normal capacity.` };
    case 'emergency':
      return { type: 'info', title: 'Emergency pre-emption', message: event.message };
    default:
      return { type: 'info', title: 'Notice', message: event.message || '' };
  }
}

/** Prepend new alerts (newest first), keeping at most `max`. */
export function pushAlerts(list, events, simTime, describe, max = 20) {
  if (!events.length) return list;
  const stamp = formatSimTime(simTime);
  const fresh = events.map((e, i) => ({
    id: `${simTime}-${e.kind}-${e.key ?? e.from ?? e.node ?? ''}-${i}`,
    timestamp: `t ${stamp}`,
    ...alertMessage(e, describe),
  }));
  return [...fresh.reverse(), ...list].slice(0, max);
}

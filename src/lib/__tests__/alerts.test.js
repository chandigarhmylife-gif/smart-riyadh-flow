import { describe, it, expect } from 'vitest';
import { updateQueueAlerts, alertMessage, pushAlerts, formatSimTime } from '../alerts';

describe('queue alerts', () => {
  const T = { high: 15, clear: 5 };

  it('opens an alert when a queue reaches the threshold', () => {
    const r = updateQueueAlerts(new Set(), { north: 15, east: 3 }, T);
    expect([...r.active]).toEqual(['north']);
    expect(r.events).toEqual([{ kind: 'queue-high', key: 'north', value: 15 }]);
  });

  it('does not repeat or close the alert between the two thresholds (hysteresis)', () => {
    const r = updateQueueAlerts(new Set(['north']), { north: 9 }, T);
    expect(r.events).toEqual([]);
    expect(r.active.has('north')).toBe(true);
  });

  it('closes the alert once the queue clears', () => {
    const r = updateQueueAlerts(new Set(['north']), { north: 4 }, T);
    expect(r.events).toEqual([{ kind: 'queue-cleared', key: 'north', value: 4 }]);
    expect(r.active.size).toBe(0);
  });
});

describe('alert text', () => {
  it('describes queue, spillback and incident events', () => {
    expect(alertMessage({ kind: 'queue-high', key: 'north', value: 17 }, (k) => `${k} approach`))
      .toEqual({ type: 'warning', title: 'Queue building', message: 'North approach: 17 vehicles waiting.' });
    expect(alertMessage({ kind: 'spillback', fromName: 'King Fahd / Tahlia', toName: 'Olaya / Tahlia' }).message)
      .toBe('Queue from Olaya / Tahlia has backed up to King Fahd / Tahlia; vehicles there are blocked.');
    expect(alertMessage({ kind: 'incident-cleared', name: 'Olaya / Tahlia' }).type).toBe('success');
  });

  it('formats simulation time as m:ss', () => {
    expect(formatSimTime(0)).toBe('0:00');
    expect(formatSimTime(605)).toBe('10:05');
  });

  it('keeps the newest alerts first, up to the limit', () => {
    let list = [];
    list = pushAlerts(list, [{ kind: 'queue-high', key: 'a', value: 20 }], 10, (k) => k, 2);
    list = pushAlerts(list, [{ kind: 'queue-high', key: 'b', value: 20 }, { kind: 'queue-high', key: 'c', value: 20 }], 20, (k) => k, 2);
    expect(list.map((a) => a.message)).toEqual(['C: 20 vehicles waiting.', 'B: 20 vehicles waiting.']);
    expect(list[0].timestamp).toBe('t 0:20');
  });
});

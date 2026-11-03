// Queue-based traffic model for a single four-approach signalised intersection.
//
// Each second, vehicles arrive on every approach (Poisson process), join a queue,
// and discharge at the saturation flow rate while their signal is green
// (half rate on yellow, nothing during the start-up lost time). All KPIs are derived from these queues, so they respond
// to signal timing, demand, time of day and weather instead of being random.
//
// The model is pure: state in, new state out. Pass a seeded RNG for
// reproducible runs (and so a fixed-time baseline can see identical arrivals).

export const DIRECTIONS = ['north', 'south', 'east', 'west'];

/** Saturation flow of one lane in vehicles per hour of green (HCM base value). */
export const SATURATION_FLOW_PER_LANE = 1800;

/** Default approach demand in vehicles per hour, before time-of-day scaling. */
export const DEFAULT_DEMAND = 450;

/** Start-up lost time at the beginning of each green, seconds (HCM default 2 s). */
export const STARTUP_LOST_TIME_S = 2;

/** Average CO2 emitted by an idling passenger car, grams per second. */
export const IDLE_CO2_G_PER_S = 0.64;

export const TIME_OF_DAY_FACTORS = {
  night: 0.35,
  morning: 0.8,
  'rush-hour': 1.3,
  midday: 0.9,
  evening: 1.15,
};

// demand: share of normal trips still made; capacity: share of saturation flow achieved
export const WEATHER_FACTORS = {
  clear: { demand: 1, capacity: 1 },
  cloudy: { demand: 1, capacity: 0.97 },
  rain: { demand: 0.95, capacity: 0.85 },
  'heavy-rain': { demand: 0.85, capacity: 0.75 },
  fog: { demand: 0.9, capacity: 0.8 },
  snow: { demand: 0.8, capacity: 0.7 },
  storm: { demand: 0.75, capacity: 0.65 },
};

const THROUGHPUT_WINDOW_S = 300;

/** Small, fast, seedable PRNG (mulberry32). Returns a function giving [0, 1). */
export function createRng(seed = 1) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Poisson-distributed integer with mean `lambda` (Knuth; fine for small lambda). */
export function samplePoisson(lambda, rng) {
  if (lambda <= 0) return 0;
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= rng();
  } while (p > limit);
  return k - 1;
}

/**
 * Build the per-approach demand (veh/h) after time-of-day and weather scaling.
 * `demand` may be a single number or an object keyed by direction.
 */
export function effectiveDemand({ demand = DEFAULT_DEMAND, timeOfDay = 'midday', weather = 'clear' } = {}) {
  const tod = TIME_OF_DAY_FACTORS[timeOfDay] ?? 1;
  const w = (WEATHER_FACTORS[weather] ?? WEATHER_FACTORS.clear).demand;
  return Object.fromEntries(
    DIRECTIONS.map((d) => {
      const base = typeof demand === 'object' ? demand[d] ?? DEFAULT_DEMAND : demand;
      return [d, base * tod * w];
    })
  );
}

export function createTrafficModel(options = {}) {
  const { lanes = 1, weather = 'clear' } = options;
  const capacityFactor = (WEATHER_FACTORS[weather] ?? WEATHER_FACTORS.clear).capacity;
  return {
    demand: effectiveDemand(options),
    dischargePerSecond: (SATURATION_FLOW_PER_LANE * lanes * capacityFactor) / 3600,
    approaches: Object.fromEntries(
      DIRECTIONS.map((d) => [d, { queue: 0, credit: 0, arrived: 0, departed: 0, greenFor: 0 }])
    ),
    elapsed: 0,
    totalDelay: 0, // vehicle-seconds spent waiting in queues
    greenSeconds: 0, // approach-seconds of green/yellow shown
    usedGreenSeconds: 0, // approach-seconds of green/yellow with vehicles waiting
    recentDepartures: [], // departures per second, last THROUGHPUT_WINDOW_S seconds
  };
}

/** Advance the model by one second under the given signal states. */
export function stepTrafficModel(model, signalStates, rng = Math.random) {
  let departedThisSecond = 0;
  let greenSeconds = 0;
  let usedGreenSeconds = 0;
  let delay = 0;

  const approaches = {};
  for (const d of DIRECTIONS) {
    const a = model.approaches[d];
    const arrivals = samplePoisson(model.demand[d] / 3600, rng);
    let queue = a.queue + arrivals;
    let credit = a.credit;
    let departed = 0;

    const signal = signalStates[d];
    const showing = signal === 'green' || signal === 'yellow';
    const greenFor = showing ? a.greenFor + 1 : 0;
    if (showing) {
      greenSeconds += 1;
      // Green shown to an approach with vehicles waiting counts as used.
      if (queue > 0) usedGreenSeconds += 1;
      if (greenFor > STARTUP_LOST_TIME_S) {
        credit += signal === 'green' ? model.dischargePerSecond : model.dischargePerSecond / 2;
      }
      while (credit >= 1 && queue > 0) {
        queue -= 1;
        credit -= 1;
        departed += 1;
      }
      // Unused capacity can't be banked once the queue is empty.
      if (queue === 0) credit = Math.min(credit, 1);
    } else {
      credit = 0;
    }

    delay += queue;
    departedThisSecond += departed;
    approaches[d] = {
      queue,
      credit,
      arrived: a.arrived + arrivals,
      departed: a.departed + departed,
      greenFor,
    };
  }

  const recentDepartures = [...model.recentDepartures, departedThisSecond];
  if (recentDepartures.length > THROUGHPUT_WINDOW_S) recentDepartures.shift();

  return {
    ...model,
    approaches,
    elapsed: model.elapsed + 1,
    totalDelay: model.totalDelay + delay,
    greenSeconds: model.greenSeconds + greenSeconds,
    usedGreenSeconds: model.usedGreenSeconds + usedGreenSeconds,
    recentDepartures,
  };
}

export function queueLengths(model) {
  return Object.fromEntries(DIRECTIONS.map((d) => [d, model.approaches[d].queue]));
}

/**
 * KPIs shown in the UI.
 * - avgWaitTime: mean queueing delay per arrived vehicle (s)
 * - throughput: departures over the last 5 minutes, as veh/h
 * - queueLength: vehicles currently queued on all approaches
 * - efficiency: share of green time given to approaches with vehicles waiting (%)
 * - totalVehicles: vehicles that have cleared the intersection
 */
export function modelMetrics(model) {
  const arrived = DIRECTIONS.reduce((s, d) => s + model.approaches[d].arrived, 0);
  const departed = DIRECTIONS.reduce((s, d) => s + model.approaches[d].departed, 0);
  const windowDepartures = model.recentDepartures.reduce((s, n) => s + n, 0);
  const windowSeconds = model.recentDepartures.length;
  return {
    avgWaitTime: arrived > 0 ? model.totalDelay / arrived : 0,
    throughput: windowSeconds > 0 ? (windowDepartures / windowSeconds) * 3600 : 0,
    queueLength: DIRECTIONS.reduce((s, d) => s + model.approaches[d].queue, 0),
    efficiency: model.greenSeconds > 0 ? (model.usedGreenSeconds / model.greenSeconds) * 100 : 0,
    totalVehicles: departed,
  };
}

/** CO2 (kg) avoided by `model` relative to `baseline`, from reduced idling. */
export function co2SavedKg(model, baseline) {
  if (!baseline) return 0;
  return Math.max(0, ((baseline.totalDelay - model.totalDelay) * IDLE_CO2_G_PER_S) / 1000);
}

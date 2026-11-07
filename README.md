# Smart Riyadh Flow

**An open-source traffic signal control and simulation platform for Riyadh.**

Smart Riyadh Flow lets traffic engineers, researchers and students build signalised-intersection scenarios on Riyadh's road network, run them, and compare signal strategies. It covers single intersections and coordinated corridors, emergency-vehicle and public-transit priority, and AI-assisted forecasting and reporting.

The project is early-stage and under active development. See the [roadmap](#roadmap) for what's coming next.

## Features

- **Queue-based traffic model.** Vehicles arrive on each approach (Poisson process), queue at red, and discharge at saturation flow on green, including start-up lost time. Wait time, throughput, queue length and efficiency are all computed from these queues. Demand scales with time of day and weather.
- **Adaptive signal control.** A queue-actuated controller extends or ends each green based on the vehicles actually waiting, within minimum and maximum green limits. It runs side by side with a fixed-time baseline on identical arrivals, so the wait-time reduction and CO₂ saved are measured rather than assumed.
- **3D intersection simulator.** A real-time three.js view of a four-approach intersection with live signal phases, queued vehicles, and per-approach countdowns.
- **Corridor network simulation.** Four linked intersections on King Fahd Rd and Olaya St (at Al Urubah and Tahlia). Vehicles leaving one signal drive to the next at road speed and join its queue, and moving vehicles are shown on the live map.
- **Green-wave coordination.** Synchronized signals are offset by the travel time between them, so southbound and eastbound platoons arrive on green. A "Coordination Impact" panel compares the run with uncoordinated signals on identical traffic: delay, share of vehicles stopping, and platoon stops by direction.
- **Platoon-aware adaptive control.** Adaptive signals that also see vehicles arriving from the previous intersection in the next 8 s. They hold green for an approaching platoon, or change early so it arrives on green.
- **Incidents and queue spillback.** Place a minor or major incident at an intersection to cut its capacity. When a queue fills the road back to the previous signal, it spills back and blocks that signal's traffic, as in real gridlock. Roads on the map are coloured green, orange or red by how full they are.
- **Real alerts.** The Live Alerts panels report actual events: queues building and clearing (with hysteresis so alerts don't flicker), spillback, incidents and emergency pre-emption, stamped with simulation time.
- **Pedestrian crossings.** Push-button pedestrian demand (none, low or high). A call makes the next adaptive green for that crossing last at least 24 s (7 s walk + 20 m at 1.2 m/s).
- **Signal Timing Advisor.** Computes the optimum fixed-time plan with Webster's method, predicts delay with Webster's delay formula, and grades plans and the live run with HCM Level of Service (A–F). An "Optimized fixed-time (Webster)" mode runs the recommended plan. Pedestrian minimum greens are respected.
- **Strategy Lab.** One click runs every control strategy on the current corridor many times (in a background Web Worker), with identical traffic for each strategy in a run. Reports means with 95% confidence intervals, a paired comparison against uncoordinated signals with a significance check, a chart, and CSV export.
- **Level of Service everywhere.** LOS grades appear on the Signal Timing Advisor and on each intersection in the network view.
- **Network controls with real effects.** Weather slows traffic and reduces capacity. Bus priority gives the King Fahd / Olaya bus corridors a longer green. The vehicle mix applies the HCM heavy-vehicle factor. Emergency vehicles pre-empt the signal at an intersection, and a switched-off signal becomes an uncontrolled junction.
- **Run timeline and CSV export.** Charts wait time and queues over the run, alongside the fixed-time baseline in adaptive mode. Every 10 s sample can be exported as CSV with the run settings.
- **Repeatable runs.** Every run has a seed. Enter it again to replay exactly the same traffic, for example to compare control strategies fairly.
- **Live map.** Intersections, vehicles and incidents plotted on OpenStreetMap around Al Urubah, Tahlia and Al Faisaliah.
- **Emergency and transit priority.** One-click green corridors for emergency vehicles, plus a bus-priority mode with impact analysis.
- **Scenario builder.** Place intersections on a canvas, define origin–destination flows and the vehicle mix, configure run settings, then save and reload scenarios.
- **AI insights.** LLM-generated 24-hour congestion forecasts, traffic analysis, recommendations and report narratives, built from the current simulation metrics.
- **Reports.** Many report templates covering corridor performance, incidents, emissions, and AI vs. fixed-time comparisons. Reports can be printed or saved as PDF from the browser and sent by email.
- **Traffic data import.** Upload CSV/JSON detector counts with validation, error reporting and normalisation.
- **Operations screens.** Incidents, alerts, devices, AI models, performance baselines, emissions, and a public information display.

## Current limitations

These are listed openly so contributors know where help is most useful:

- The models don't yet include separate turning lanes or pedestrian delay. Spillback blocks a whole approach rather than only its through movement. Parameters use textbook defaults rather than values calibrated to Riyadh counts.
- The green wave favours southbound and eastbound traffic; northbound and westbound get whatever progression the same offsets give them.
- Some panels (the bus feed in Transit Priority, the Dashboard's live-stream tile) are still illustrative and labelled as demo feeds. Dashboard KPI cards use saved results, or a real 1-hour reference simulation until results exist.
- LOS is graded from queueing delay, which is close to but slightly less than HCM control delay (which also counts deceleration and acceleration).
- Intersection coordinates are **approximate** and the network is a small demo corridor, not the full Riyadh road graph.
- The operations screens (incidents, devices, models, users) use sample data and are not yet persisted.

## How the simulation works

| Parameter | Value | Notes |
|---|---|---|
| Saturation flow | 1,800 veh/h/lane | HCM base value, reduced in bad weather (to 65% in a storm) |
| Start-up lost time | 2 s per green | No discharge in the first 2 s of each green |
| Default demand | 450 veh/h per approach | ×1.3 at rush hour, ×0.35 at night. Taken from scenario flows when present |
| Fixed-time plan | 30 s N-S, 4 s yellow, 25 s E-W, 4 s yellow | 63 s cycle |
| Adaptive limits | 10 s min green, 50 s max green | Gaps out once the served queue is ≤ 1 vehicle and traffic is waiting on the cross street |
| Idling CO₂ | 0.64 g/s per vehicle | Used for CO₂ saved versus the fixed-time baseline |
| Heavy vehicles | PCE 2.0 | HCM factor f_HV = 1 / (1 + P_HV) reduces discharge rate |

### Model validation

The single-intersection model is checked against **Webster's delay formula**, the classic analytical result for fixed-time signals. Across demand levels from v/c ≈ 0.25 to 0.8, simulated average delay is within about 10% of Webster's prediction (slightly lower, as expected, since Webster's formula is known to overestimate slightly). This is enforced by automated tests at three demand levels (within 15%).

| Demand (veh/h/approach) | Webster (30/25 plan) | Simulated |
|---|---|---|
| 225 | 12.3 s | 11.6 s |
| 405 | 14.8 s | 13.4 s |
| 540 | 17.9 s | 16.8 s |

Simulated values are means of ten 2-hour runs. Webster's optimum plan reduced delay by roughly 12–30% versus the standard 30/25 plan at these demands (largest at low demand), in both the formula and the simulation.

**Stops** counts a vehicle as stopped if it reaches a non-green signal or joins an existing queue.

### Corridor network

| Parameter | Value | Notes |
|---|---|---|
| Lanes per approach | 2 | King Fahd Rd and Olaya St are multi-lane arterials |
| Link speed | 50 km/h | Slower in bad weather. About 37 s between Al Urubah and Tahlia legs, 106 s along King Fahd and Olaya |
| Through movement | 80% | Share of vehicles leaving a signal that continue straight to the next one |
| Side-street demand | 15% | Extra demand on approaches fed by an upstream signal |
| Bus priority plan | 35 s N-S / 20 s E-W | Versus 30 s / 25 s normally |
| Linking rule | Nearest neighbour within 35° of a compass axis, up to 2.5 km | |
| Link storage | lane length ÷ 7.5 m per queued vehicle | Moving vehicles count as ¼ of a queued one. A full link blocks the upstream approach (spillback) |
| Platoon look-ahead | 8 s | For platoon-aware adaptive control |
| Incidents | Minor −50%, major −75% capacity | |

Across six 15-minute runs, the green wave cut platoon stops from about **60% to 38%** (southbound from 100% to about 30%) and average delay by about 10–20%, compared with uncoordinated fixed-time signals. Isolated adaptive control cut delay further but stopped most platoons (about 88%), a known trade-off between local actuation and corridor coordination. **Platoon-aware adaptive control** removed most of that trade-off: lowest average delay of all modes (about 5.3 s against 8.4 s for the green wave and 9.3 s uncoordinated) with platoon stops down to about 50%. As before, these are results *within this model*.

**Efficiency** is the share of green time given to approaches that have vehicles waiting, i.e. green that isn't wasted on an empty road. **Average wait** is total queueing delay divided by vehicles arrived.

Across five one-hour runs per scenario, adaptive control cut average wait by roughly **30–50%** versus the fixed-time plan, with no loss of throughput. This is a result *within this model*; real-world gains depend on calibration.

## Tech stack

| Area | Tools |
|---|---|
| UI | React 18, Vite 6, Tailwind CSS, shadcn/ui (Radix) |
| Visualisation | three.js (`@react-three/fiber`), Leaflet / react-leaflet, Recharts |
| Data | TanStack Query |
| Backend | [Base44](https://base44.com): auth, `TrafficScenario` entity storage, LLM, email and file-upload integrations |
| Tests | Vitest |

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone https://github.com/<your-username>/smart-riyadh-flow.git
cd smart-riyadh-flow
npm install
```

Create a `.env.local` file with your Base44 app settings:

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

Then run:

```bash
npm run dev      # start the dev server
npm test         # run unit tests
npm run build    # production build into ./dist
npm run lint     # lint
```

## Project structure

```
src/
  pages/            One file per route (auto-registered in pages.config.js)
  components/
    Simulation/     3D canvas, controls, signal indicators, AI decision log
    Network/        Multi-intersection network view
    ScenarioBuilder/  Canvas editor, flows, vehicle mix, run config
    AI/             LLM forecast, analysis, recommendations, reports
    Reports/        Report templates, layouts, distribution
    Map/            Leaflet traffic map
    ui/             shadcn/ui primitives
  hooks/
    useSimulationEngine.js   Single-intersection simulation loop
    useNetworkSimulation.js  Multi-intersection simulation loop
  lib/
    trafficModel.js    Queue-based traffic model and KPIs (pure, tested)
    networkModel.js    Linked-intersection corridor model and green waves (pure, tested)
    csv.js             CSV export helper (tested)
    alerts.js          Alert rules and messages (tested)
    timingAdvisor.js   Webster timing, Webster delay, HCM LOS (tested)
    experiments.js     Strategy Lab: batch runs and 95% CIs (tested)
    referenceRun.js    Headless single-intersection runs (tested)
  workers/
    strategyLab.worker.js  Runs Strategy Lab experiments off the main thread
    signalTiming.js    Fixed-time and adaptive signal controllers (pure, tested)
    networkMetrics.js  Network KPI aggregation (pure, tested)
    trafficData.js     CSV/JSON parsing and validation (pure, tested)
base44/entities/    Data model (TrafficScenario)
```

## Roadmap

- [x] Queue-based traffic model for the intersection simulator
- [x] Adaptive (queue-actuated) signal control benchmarked against the fixed-time plan
- [ ] Turning movements, multiple lanes and pedestrian phases
- [x] Extend the queue model to the multi-intersection network, with green-wave coordination
- [x] Coordinated adaptive control (adaptive signals that respect upstream platoons)
- [x] Queue spillback between closely spaced intersections
- [x] Incidents and pedestrian push-button calls
- [x] Webster timing advisor, HCM Level of Service and model validation
- [x] Strategy Lab with confidence intervals
- [ ] Separate turning lanes and protected turn phases
- [ ] Calibrate demand and saturation flow against real Riyadh counts
- [ ] Import the real Riyadh road network from OpenStreetMap
- [ ] Persist incidents, devices and alerts
- [ ] Arabic / English interface with RTL support
- [x] Continuous integration (tests and build on every push)
- [ ] Broader test coverage (React components)
- [x] Contributor guide
- [ ] Architecture docs

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, project layout and PR guidelines.

## License

[MIT](LICENSE) © 2026 Bilal Ahmed

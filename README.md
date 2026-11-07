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

- The models don't yet include turning movements, pedestrians, or queue spillback blocking an upstream intersection. Parameters use textbook defaults rather than values calibrated to Riyadh counts.
- The green wave favours southbound and eastbound traffic; northbound and westbound get whatever progression the same offsets give them.
- Some panels (live alerts, the bus feed in Transit Priority, the Dashboard's demo metrics) are still illustrative.
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

Across six 15-minute runs, the green wave cut platoon stops from about **60% to 38%** (southbound from 100% to about 30%) and average delay by about 10–20%, compared with uncoordinated fixed-time signals. Isolated adaptive control gave the lowest average delay but stopped most platoons, a known trade-off between local actuation and corridor coordination. As before, these are results *within this model*.

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
- [ ] Coordinated adaptive control (adaptive signals that respect upstream platoons)
- [ ] Queue spillback between closely spaced intersections
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

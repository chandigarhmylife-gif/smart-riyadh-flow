# Smart Riyadh Flow

**An open-source traffic signal control and simulation platform for Riyadh.**

Smart Riyadh Flow lets traffic engineers, researchers and students build signalised-intersection scenarios on Riyadh's road network, run them, and compare signal strategies. It covers single intersections and coordinated corridors, emergency-vehicle and public-transit priority, and AI-assisted forecasting and reporting.

The project is early-stage and under active development. See the [roadmap](#roadmap) for what's coming next.

## Features

- **3D intersection simulator.** A real-time three.js view of a four-approach intersection with live signal phases, vehicle queues, and per-approach countdowns.
- **Network simulation.** Coordinate several intersections along the King Fahd Rd / Olaya St corridor. Toggle synchronisation, take signals offline, and see how weather, transit priority and emergencies affect network KPIs.
- **Live map.** Intersections, vehicles and incidents plotted on OpenStreetMap around Al Urubah, Tahlia and Al Faisaliah.
- **Emergency and transit priority.** One-click green corridors for emergency vehicles, plus a bus-priority mode with impact analysis.
- **Scenario builder.** Place intersections on a canvas, define origin–destination flows and the vehicle mix, configure run settings, then save and reload scenarios.
- **AI insights.** LLM-generated 24-hour congestion forecasts, traffic analysis, recommendations and report narratives, built from the current simulation metrics.
- **Reports.** Many report templates covering corridor performance, incidents, emissions, and AI vs. fixed-time comparisons. Reports can be printed or saved as PDF from the browser and sent by email.
- **Traffic data import.** Upload CSV/JSON detector counts with validation, error reporting and normalisation.
- **Operations screens.** Incidents, alerts, devices, AI models, performance baselines, emissions, and a public information display.

## Current limitations

These are listed openly so contributors know where help is most useful:

- The single-intersection controller runs a **fixed-time plan**: N-S green 30 s, yellow 4 s, E-W green 25 s, yellow 4 s, for a 63 s cycle. KPIs (wait time, throughput, queue length) are currently **stochastic approximations**, not yet a calibrated traffic-flow model.
- Intersection coordinates are **approximate** and the network is a small demo corridor, not the full Riyadh road graph.
- The operations screens (incidents, devices, models, users) use sample data and are not yet persisted.

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
    signalTiming.js    Signal plan and phase-cycle logic (pure, tested)
    networkMetrics.js  Network KPI aggregation (pure, tested)
    trafficData.js     CSV/JSON parsing and validation (pure, tested)
base44/entities/    Data model (TrafficScenario)
```

## Roadmap

- [ ] Replace the stochastic KPIs with a queueing / cell-transmission traffic model
- [ ] Adaptive signal control (actuated and AI-optimised timing) benchmarked against the fixed-time plan
- [ ] Import the real Riyadh road network from OpenStreetMap
- [ ] Persist incidents, devices and alerts
- [ ] Arabic / English interface with RTL support
- [ ] Broader test coverage and CI
- [ ] Contributor guide and architecture docs

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first so we can discuss the approach. Run `npm test` and `npm run lint` before submitting a PR.

## License

[MIT](LICENSE) © 2026 Bilal Ahmed

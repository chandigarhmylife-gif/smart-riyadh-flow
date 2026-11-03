# Contributing to Smart Riyadh Flow

Thanks for your interest in improving Smart Riyadh Flow. Bug reports, ideas and pull requests are all welcome.

## Getting set up

```bash
git clone https://github.com/chandigarhmylife-gif/smart-riyadh-flow.git
cd smart-riyadh-flow
npm install
npm test        # unit tests (Vitest)
npm run dev     # local dev server
```

See the README for the `.env.local` values needed to connect to the Base44 backend.

## Where things live

- `src/lib/` holds the core logic as **pure, tested functions**: the traffic model (`trafficModel.js`), signal controllers (`signalTiming.js`), network KPIs and data import. Most behaviour changes should start here, with tests.
- `src/hooks/` connects that logic to React (`useSimulationEngine`, `useNetworkSimulation`).
- `src/pages/` and `src/components/` contain the UI.

## Pull requests

1. Open an issue first for larger changes so we can agree on the approach.
2. Keep PRs focused on one change.
3. Add or update tests in `src/lib/__tests__/` for any logic change.
4. Make sure `npm test` and `npm run lint` pass. CI runs tests and a production build on every PR.
5. Describe what changed and why in the PR description.

## Modelling changes

If you change the traffic model or a signal controller, include a short note in the PR on the assumption you changed (for example saturation flow, lost time or green limits) and, where possible, a source. The goal is a model traffic engineers can trust and check.

## Reporting bugs

Please include steps to reproduce, what you expected, what happened, and your browser and OS.

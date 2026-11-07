// Runs Strategy Lab experiments off the main thread so the page stays responsive.
import { runExperiment } from '../lib/experiments';

self.onmessage = (event) => {
  const { nodes, options } = event.data;
  try {
    let last = 0;
    const result = runExperiment(nodes, options, (done, total) => {
      const now = Date.now();
      if (now - last > 100 || done === total) {
        last = now;
        self.postMessage({ type: 'progress', done, total });
      }
    });
    self.postMessage({ type: 'done', result });
  } catch (error) {
    self.postMessage({ type: 'error', message: error?.message || String(error) });
  }
};

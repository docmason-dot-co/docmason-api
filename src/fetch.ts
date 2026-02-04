// Fetch adapter to handle both browser and Node.js environments
export type FetchFunction = typeof fetch;

let globalFetch: FetchFunction;

// Detect environment and set up fetch accordingly
if (typeof globalThis !== 'undefined' && globalThis.fetch) {
  // Browser environment or Node.js with fetch
  globalFetch = globalThis.fetch.bind(globalThis);
} else if (typeof global !== 'undefined' && global.fetch) {
  // Node.js with fetch polyfill
  globalFetch = global.fetch;
} else {
  // Node.js without fetch - try to import node-fetch
  try {
    // Dynamic import for node-fetch (peer dependency)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeFetch = require('node-fetch');
    globalFetch = nodeFetch.default || nodeFetch;
  } catch (error) {
    throw new Error(
      'Fetch is not available. This may indicate an issue with the node-fetch dependency installation.'
    );
  }
}

export { globalFetch as fetch };
import { benchmarkAsync } from "../../src";     // Note: import "hotloop" instead of "../src"

const done = new Promise((resolve) => resolve());

benchmarkAsync(`Async`, async (deferred) => {
    // Await a resolved promise to defer to the next microtask.
    await done;

    // Note that the returned promise from this async function is ignored.
    // To complete the benchmark iteration, we must call 'deferred.resolve()'
    deferred.resolve();
});

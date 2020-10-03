import { benchmarkPromise } from "../../src";     // Note: import "hotloop" instead of "../src"

const done = new Promise((resolve) => resolve());

benchmarkPromise(`Promise`, async () => {
    // Await a resolved promise to defer to the next microtask.
    await done;

    // Note that the benchmark iteration completes when the Promise
    // returned from this async function resolves.
});

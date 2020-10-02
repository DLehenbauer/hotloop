import { benchmarkAsync } from "../../src";     // Note: import "hotloop" instead of "../src"

const done = new Promise((resolve) => resolve());

benchmarkAsync(`Async`, async (deferred) => {
    await done;
    deferred.resolve();
});

import { benchmarkPromise } from "../../src";     // Note: import "hotloop" instead of "../src"

const done = new Promise((resolve) => resolve());

benchmarkPromise(`Promise`, async () => {
    await done;
});

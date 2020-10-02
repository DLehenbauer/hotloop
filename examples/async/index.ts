import { run } from "../../src";       // Import "hotloop" instead of "../src"

(async () => {
    await run([
        { path: "./async.ts" },
        { path: "./promise.ts" },
    ]);
})();

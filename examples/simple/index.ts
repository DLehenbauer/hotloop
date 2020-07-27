import { run } from "../../src";       // Import "hotloop" instead of "../src"

(async () => {
    await run([
        { path: "./math-random.ts" },
        { path: "./xkcd-random.ts" },
    ]);
})();

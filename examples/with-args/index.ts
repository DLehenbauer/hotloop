import { run } from "../../src";       // Import "hotloop" instead of "../src"

(async () => {
    await run([
        { path: "./random.ts", args: { generator: "Math.random" }},
        { path: "./random.ts", args: { generator: "Xkcd.random" }},
    ]);
})();

import { run } from "../../src";       // Import "hotloop" instead of "../src"

// Use 'args' to pass any JSON serializable object to the benchmark.
run([
    { path: "./random.ts", args: { generator: "Math.random" }},
    { path: "./random.ts", args: { generator: "Xkcd.random" }},
]);

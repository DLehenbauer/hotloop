import { run } from "../../src";       // Import "hotloop" instead of "../src"

run([
    { path: "./async.ts" },
    { path: "./promise.ts" },
]);

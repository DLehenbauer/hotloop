# Hotloop
Improves the accuracy/stability of [Benchmark](https://www.npmjs.com/package/benchmark) suites by executing each test in a separate Node.js process.

## Installation
```
npm i hotloop --save
```
## Usage
Put each benchmark in a separate file, like this:
```js
// FILE: math-random.js
const { benchmark } = require("hotloop");

benchmark("Math.random()", () => {
    return Math.random();
});
```
```js
// FILE: xkcd-random.js
const { benchmark } = require("hotloop");

// Credit: https://xkcd.com/221/
benchmark("Xkcd.random()", () => {
    return 4;   // chosen by fair dice roll.
                // guaranteed to be random.
});
```
Then create an index.js to execute the suite like this:
```js
// FILE: index.js
const { run } = require("hotloop");

run([
    { path: "./math-random.js" },
    { path: "./xkcd-random.js" },
]);
```
Run the benchmark with node:
```
node index.js
```
A separate Node.js process is spawned for each benchmark and the results collected and summarized in a table like this:
```
┌─────────┬─────────────────┬──────────────────┬───────────┬─────────┐
│ (index) │      name       │     ops/sec      │    rme    │ samples │
├─────────┼─────────────────┼──────────────────┼───────────┼─────────┤
│    0    │ 'Xkcd.random()' │ '529,785,828.06' │ '±20.00%' │   49    │
│    1    │ 'Math.random()' │  '9,746,454.15'  │ '±37.29%' │   30    │
└─────────┴─────────────────┴──────────────────┴───────────┴─────────┘
```

### Async/Promise Example
Use the 'benchmarkPromise()' function to benchmark async functions using promises.
```ts
// An iteration of a promise benchmark completes when the Promise
// returned by the async function is resolved.
benchmarkPromise(`Promise`, async () => {
    await myPromise;
});
```

### Async/Callback Example
Use 'benchmarkAsync()' to measure async functions using a callback to signal
completion rather than a returned Promise.
```ts
// An iteration of the async benchmark complete when the provided
// 'deferred.resolve()' function is invoked.
benchmarkAsync(`Async`, (deferred) => {
    setTimeout(() => {
        deferred.resolve();     // Complete the iteration
    }, 200);
});
```
### Passing test arguments
Often it is useful to run multiple variations of the same benchmark (for example
with different load parameters).

Use the 'args' parameter to pass configuration to your benchmark:
```ts
// Use 'args' to pass any JSON serializable object to the benchmark.
run([
    { path: "./random.ts", args: { generator: "Math" }},
    { path: "./random.ts", args: { generator: "Xkcd" }},
]);
```
Inside your benchmark, retrieve your test args using 'getTestArgs()'.
```ts
// Use 'getTestArgs()' to retrieve the args inside the benchmark file.
const args = getTestArgs();

// Use the test 'args' to choose which PRNG to benchmark:
const rng = args.generator === "Math"
    ? Math.random
    : () => 4;

benchmark(`${args.generator}()`, () => {
    return rng();
});
```
## Debugging
See this project's [.vscode/launch.json](https://github.com/DLehenbauer/hotloop/blob/master/.vscode/launch.json) for examples of debugging benchmarks with VS Code.

Of particular note is the "--runInBand" option which executes all benchmarks inside the host process instead of spawning separate processes for each:
```
node index.js --runInBand
```

# Hotloop
Improves the accuracy/stability of [Benchmark](https://www.npmjs.com/package/benchmark) suites by executing each test in a separate Node.js process.

## Installation
```
npm i hotloop --save
```
## Usage
Put each test case in a separate file, like this:
```ts
// FILE: math-random.ts
import { benchmark } from "hotloop";

benchmark("Math.random()", () => {
    return Math.random();
});
```
```ts
// FILE: xkcd-random.ts
benchmark("Xkcd.random()", () => {
    return 4;   // chosen by fair dice roll.
                // guaranteed to be random.
});

// https://xkcd.com/221/
```
Then create an index.ts to execute the suite like this:
```ts
import { run } from "hotloop";

(async () => {
    await run([
        { "path": "./math-random.ts" },
        { "path": "./xkcd-random.ts" },
    ]);
})();
```

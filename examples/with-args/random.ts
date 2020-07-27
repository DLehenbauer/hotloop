import { benchmark, getTestArgs } from "../../src";     // Note: import "hotloop" instead of "../src"

const args = getTestArgs();

const rng = args.generator === "Math.random"
    ? Math.random
    : () => {
        return 4;   // chosen by fair dice roll.
                    // guaranteed to be random.
    };  // https://xkcd.com/221/

benchmark(`${args.generator}()`, () => {
    return rng();
});

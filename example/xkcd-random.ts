import { benchmark } from "../src";     // Note: import "hotloop" instead of "../src"

benchmark("Xkcd.random()", () => {
    return 4;   // chosen by fair dice roll.
                // guaranteed to be random.
});

// https://xkcd.com/221/

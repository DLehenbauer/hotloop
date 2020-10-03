const { benchmark } = require("../..");       // Import "hotloop" instead of "../.."

// Credit: https://xkcd.com/221/
benchmark("Xkcd.random()", () => {
    return 4;   // chosen by fair dice roll.
                // guaranteed to be random.
});

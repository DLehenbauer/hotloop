const { run } = require("../..");       // Import "hotloop" instead of "../.."

run([
    { path: "./math-random.js" },
    { path: "./xkcd-random.js" },
]);

const { benchmark } = require("../..");       // Import "hotloop" instead of "../.."

benchmark("Math.random()", () => {
    return Math.random();
});

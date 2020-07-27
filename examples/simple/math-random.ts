import { benchmark } from "../../src";     // Note: import "hotloop" instead of "../src"

benchmark("Math.random()", () => {
    return Math.random();
});

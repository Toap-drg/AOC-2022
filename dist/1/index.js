"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const data = (0, utils_1.read)("src/1/input.txt").trim();
const CountCalories = (bucket) => {
    let total = 0;
    for (const entry of bucket.split("\n")) {
        total += parseInt(entry);
    }
    return total;
};
const Part1 = () => {
    // get calories per elf
    const buckets = data.split("\n\n").map(CountCalories);
    // Find the max calories
    const max = Math.max(...buckets);
    // answer
    return max;
};
exports.Part1 = Part1;
const Part2 = () => {
    // get calories per elf
    const buckets = data.split("\n\n").map(CountCalories);
    // Sort calories
    buckets.sort((a, b) => a - b);
    // Get top(n) calories
    const top = (i) => buckets[buckets.length - i];
    // Sum top 3 calories
    const top3 = top(1) + top(2) + top(3);
    // answer
    return top3;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
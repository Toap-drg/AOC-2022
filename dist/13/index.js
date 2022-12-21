"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const Load = (file) => (0, utils_1.read)(file).split("\n\n").map(pair => {
    const [L, R] = pair.split("\n").map(line => JSON.parse(line));
    return { L, R };
});
// const data = Load("src/13/sample.txt");
const data = Load("src/13/input.txt");
// Compare Packages
const cmp = (L, R) => {
    // Check L
    switch (typeof L) {
        case "undefined":
            if (typeof R === "undefined") {
                return 0; // Equal number of items
            }
            else {
                return -1; // R has more items
            }
        case "number":
            if (typeof R === "number") {
                return L - R; // Compare numbers
            }
            else {
                L = [L]; // Package L
            }
    }
    // Check R
    switch (typeof R) {
        case "undefined":
            return 1; // L has more items
        case "number":
            R = [R]; // Package R
    }
    // Use the longest length
    const len = Math.max(L.length, R.length);
    for (let i = 0; i < len; i++) {
        // Compare elements
        const res = cmp(L[i], R[i]);
        // Return when not equal
        if (res !== 0)
            return res;
    }
    // R & L is equal
    return 0;
};
const Part1 = () => {
    let total = 0;
    // Sum the indices of the correclty ordered package pairs
    data.forEach(({ L, R }, i) => {
        const I = i + 1;
        // console.log("===", "Pair", I, "===");
        let res = cmp(L, R);
        if (res <= 0)
            total += I;
        // console.log(res >= 0 ? "In" : "Out of", "order\n");
    });
    return total;
};
exports.Part1 = Part1;
const Part2 = () => {
    // Concatinate all packages
    const flat = data.flatMap(({ L, R }) => [L, R]);
    // Include divider packets
    const p2 = [[2]];
    const p6 = [[6]];
    flat.push(p2, p6);
    // Sort Packages
    flat.sort(cmp);
    // Find indices (1-indexed)
    const i2 = flat.indexOf(p2) + 1;
    const i6 = flat.indexOf(p6) + 1;
    // Decoder key
    return i2 * i6;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
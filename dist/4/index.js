"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const data = (0, utils_1.read)("src/4/input.txt").split("\n").map(line => line.split(",").map(range => range.split("-").map(int => parseInt(int))));
const Contains = ([AS, AE], [BS, BE]) => {
    return (AS <= BS && BE <= AE) || (BS <= AS && AE <= BE);
};
const Outside = ([AS, AE], [BS, BE]) => {
    return (AS > BE || BS > AE);
};
const Part1 = () => {
    let total = 0;
    for (const [A, B] of data) {
        total += +Contains(A, B);
    }
    return total;
};
exports.Part1 = Part1;
const Part2 = () => {
    let total = 0;
    for (const [A, B] of data) {
        total += +!Outside(A, B);
    }
    return total;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
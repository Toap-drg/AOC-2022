"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const data = (0, utils_1.read)("src/3/input.txt").split("\n");
const Match = (a, b) => {
    return [...a].filter(c => b.includes(c)).join("");
};
const Codes = {
    a: "a".charCodeAt(0),
    z: "z".charCodeAt(0),
    A: "A".charCodeAt(0),
    Z: "Z".charCodeAt(0),
};
const Rate = (c) => {
    const C = c.charCodeAt(0);
    if (Codes.a <= C && C <= Codes.z)
        return (1 + C - Codes.a);
    if (Codes.A <= C && C <= Codes.Z)
        return (27 + C - Codes.A);
    throw new Error(`Invalid char: (${C} : "${c}")`);
};
const Part1 = () => {
    let total = 0;
    for (const line of data) {
        const l = line.length;
        const h = l / 2;
        const L = line.slice(0, h);
        const R = line.slice(h, l);
        const M = Match(L, R)[0];
        total += Rate(M);
    }
    return total;
};
exports.Part1 = Part1;
const Chunk = (arr, size) => {
    const out = Array();
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + 3));
    }
    return out;
};
const Part2 = () => {
    let total = 0;
    for (const [A, B, C] of Chunk(data, 3)) {
        const AB = Match(A, B);
        const BC = Match(B, C);
        const M = Match(AB, BC);
        total += Rate(M);
    }
    return total;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
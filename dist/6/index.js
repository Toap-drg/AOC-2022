"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const data = (0, utils_1.read)("src/6/input.txt");
const Scan = (text, size) => {
    const N = text.length;
    for (let i = 0; i < N; i++) {
        const span = text.substring(i, i + size);
        if (new Set(span).size === size) {
            return i + size;
        }
    }
    return undefined;
};
const Part1 = () => {
    return Scan(data, 4);
};
exports.Part1 = Part1;
const Part2 = () => {
    return Scan(data, 14);
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
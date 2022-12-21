"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const LoadData = () => {
    const [drawing, lines] = (0, utils_1.read)("src/5/input.txt").split("\n\n");
    const [ix, ...rows] = drawing.split("\n").reverse();
    const length = parseInt(ix.substring(ix.length - 3));
    return {
        instructions: lines.split("\n").map(line => {
            const [_move, M, _from, F, _to, T] = line.split(" ");
            return {
                move: parseInt(M),
                from: parseInt(F),
                to: parseInt(T),
            };
        }),
        stack: () => {
            const out = [];
            // init stacks
            for (let i = 0; i < length; i++)
                out.push([]);
            // fill stacks
            for (const row of rows) {
                for (let i = 0; i < length; i++) {
                    const c = row.charAt((i * 4) + 1);
                    if (c !== " ")
                        out[i].push(c);
                }
            }
            // done
            return out;
        },
    };
};
const { instructions, stack } = LoadData();
const DebugStack = (stack) => {
    const max = Math.max(...stack.map(s => s.length)) * 2;
    const txt = stack.map(s => s.join("|").padEnd(max, " "));
    console.table(txt);
};
const Part1 = () => {
    const S = stack();
    for (const { move, from, to } of instructions) {
        const F = S[from - 1];
        const T = S[to - 1];
        for (const c of F.splice(F.length - move, move).reverse()) {
            T.push(c);
        }
    }
    // DebugStack(S)
    // SHMSDGZVC
    return S.map(s => s.pop() ?? "$").join("");
};
exports.Part1 = Part1;
const Part2 = () => {
    const S = stack();
    for (const { move, from, to } of instructions) {
        const F = S[from - 1];
        const T = S[to - 1];
        for (const c of F.splice(F.length - move, move)) {
            T.push(c);
        }
    }
    // DebugStack(S)
    // VRZGHDFBQ
    return S.map(s => s.pop() ?? "$").join("");
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
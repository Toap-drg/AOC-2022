"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const shapePoints = {
    [0 /* G.Rock */]: 1,
    [1 /* G.Paper */]: 2,
    [2 /* G.Scissors */]: 3,
};
const roundPoints = {
    [0 /* R.Win */]: 6,
    [1 /* R.Draw */]: 3,
    [2 /* R.Loss */]: 0,
};
/**
 * Get the outcome of a play, given the opponent's play
 * ```
 * const result = game[opponent][play];
 * ```
 */
const game = {
    [0 /* G.Rock */]: {
        [0 /* G.Rock */]: 1 /* R.Draw */,
        [1 /* G.Paper */]: 0 /* R.Win */,
        [2 /* G.Scissors */]: 2 /* R.Loss */,
    },
    [1 /* G.Paper */]: {
        [0 /* G.Rock */]: 2 /* R.Loss */,
        [1 /* G.Paper */]: 1 /* R.Draw */,
        [2 /* G.Scissors */]: 0 /* R.Win */,
    },
    [2 /* G.Scissors */]: {
        [0 /* G.Rock */]: 0 /* R.Win */,
        [1 /* G.Paper */]: 2 /* R.Loss */,
        [2 /* G.Scissors */]: 1 /* R.Draw */,
    },
};
/**
 * Get the needed play for a given outcome, given the opponent's play
 * ```
 * const play = match[opponent][result];
 * ```
 */
const match = {
    [0 /* G.Rock */]: {
        [1 /* R.Draw */]: 0 /* G.Rock */,
        [0 /* R.Win */]: 1 /* G.Paper */,
        [2 /* R.Loss */]: 2 /* G.Scissors */,
    },
    [1 /* G.Paper */]: {
        [2 /* R.Loss */]: 0 /* G.Rock */,
        [1 /* R.Draw */]: 1 /* G.Paper */,
        [0 /* R.Win */]: 2 /* G.Scissors */,
    },
    [2 /* G.Scissors */]: {
        [0 /* R.Win */]: 0 /* G.Rock */,
        [2 /* R.Loss */]: 1 /* G.Paper */,
        [1 /* R.Draw */]: 2 /* G.Scissors */,
    },
};
const data = (0, utils_1.read)("src/2/input.txt");
const Part1 = () => {
    const decode = {
        A: 0 /* G.Rock */,
        B: 1 /* G.Paper */,
        C: 2 /* G.Scissors */,
        X: 0 /* G.Rock */,
        Y: 1 /* G.Paper */,
        Z: 2 /* G.Scissors */,
    };
    let total = 0;
    for (const entry of data.split("\n")) {
        const [O, P] = entry.split(" ").map(t => decode[t]);
        total += shapePoints[P];
        total += roundPoints[game[O][P]];
    }
    return total;
};
exports.Part1 = Part1;
const Part2 = () => {
    const move = {
        A: 0 /* G.Rock */,
        B: 1 /* G.Paper */,
        C: 2 /* G.Scissors */,
    };
    const strat = {
        X: 2 /* R.Loss */,
        Y: 1 /* R.Draw */,
        Z: 0 /* R.Win */,
    };
    let total = 0;
    for (const entry of data.split("\n")) {
        const [O, P] = entry.split(" ");
        const M = move[O];
        const S = strat[P];
        total += shapePoints[match[M][S]];
        total += roundPoints[S];
    }
    return total;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
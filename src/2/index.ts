import { read } from "../utils";

const enum G {
    Rock,
    Paper,
    Scissors,
}

const enum R {
    Win,
    Draw,
    Loss,
}

const shapePoints = {
    [G.Rock]: 1,
    [G.Paper]: 2,
    [G.Scissors]: 3,
}

const roundPoints = {
    [R.Win]: 6,
    [R.Draw]: 3,
    [R.Loss]: 0,
}

/**
 * Get the outcome of a play, given the opponent's play
 * ```
 * const result = game[opponent][play];
 * ```
 */
const game = {
    [G.Rock]: {
        [G.Rock]: R.Draw,
        [G.Paper]: R.Win,
        [G.Scissors]: R.Loss,
    },
    [G.Paper]: {
        [G.Rock]: R.Loss,
        [G.Paper]: R.Draw,
        [G.Scissors]: R.Win,
    },
    [G.Scissors]: {
        [G.Rock]: R.Win,
        [G.Paper]: R.Loss,
        [G.Scissors]: R.Draw,
    },
};

/**
 * Get the needed play for a given outcome, given the opponent's play
 * ```
 * const play = match[opponent][result];
 * ```
 */
const match = {
    [G.Rock]: {
        [R.Draw]: G.Rock,
        [R.Win]: G.Paper,
        [R.Loss]: G.Scissors,
    },
    [G.Paper]: {
        [R.Loss]: G.Rock,
        [R.Draw]: G.Paper,
        [R.Win]: G.Scissors,
    },
    [G.Scissors]: {
        [R.Win]: G.Rock,
        [R.Loss]: G.Paper,
        [R.Draw]: G.Scissors,
    },
};

const data = read("src/2/input.txt");

export const Part1 = () => {
    const decode = {
        A: G.Rock,
        B: G.Paper,
        C: G.Scissors,
        X: G.Rock,
        Y: G.Paper,
        Z: G.Scissors,
    }
    type Key = keyof typeof decode;

    let total = 0;
    for (const entry of data.split("\n")) {
        const [O, P] = entry.split(" ").map(t => decode[t as Key]);
        total += shapePoints[P];
        total += roundPoints[game[O][P]];
    }
    return total;
};

export const Part2 = () => {
    const move = {
        A: G.Rock,
        B: G.Paper,
        C: G.Scissors,
    };
    const strat = {
        X: R.Loss,
        Y: R.Draw,
        Z: R.Win,
    };

    let total = 0;
    for (const entry of data.split("\n")) {
        const [O, P] = entry.split(" ");
        const M = move[O as keyof typeof move];
        const S = strat[P as keyof typeof strat];
        total += shapePoints[match[M][S]];
        total += roundPoints[S];
    }
    return total;
};
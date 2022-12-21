import { read } from "../utils";

const data = read("src/3/input.txt").split("\n");

const Match = (a: string, b: string) => {
    return [...a].filter(c => b.includes(c)).join("");
}

const Codes = {
    a: "a".charCodeAt(0),
    z: "z".charCodeAt(0),
    A: "A".charCodeAt(0),
    Z: "Z".charCodeAt(0),
} as const;
const Rate = (c: string): number => {
    const C = c.charCodeAt(0);
    if (Codes.a <= C && C <= Codes.z) return (1 + C - Codes.a);
    if (Codes.A <= C && C <= Codes.Z) return (27 + C - Codes.A);
    throw new Error(`Invalid char: (${C} : "${c}")`);
}

export const Part1 = () => {
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

const Chunk = <T>(arr: T[], size: number): T[][] => {
    const out = Array<T[]>();
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + 3));
    }
    return out;
}

export const Part2 = () => {
    let total = 0;
    for (const [A, B, C] of Chunk(data, 3)) {
        const AB = Match(A, B);
        const BC = Match(B, C);
        const M = Match(AB, BC);
        total += Rate(M);
    }
    return total;
}
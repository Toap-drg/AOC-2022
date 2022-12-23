import { Key } from "readline";
import { Enum, read } from "../utils";

const Tok = Enum(".", "#")

type P = { x: number, y: number};

const Load = (file: string) => read(file).split("\n").map(
    (line, x) => line.split("").map(
        (token, y) => Tok.$parse(token) === "#" ? { x, y } : false
    ).filter((v) => v)
).flat() as P[];

// const data = Load("src/23/input.txt");
const data = Load("src/23/sample.txt");

/** Minmax a collection of numbers */
const minmax = () => {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    return {
        check(val: number) {
            if (val < min) min = val;
            if (val > max) max = val;
        },
        get min() {
            return min;
        },
        get max() {
            return max;
        },
        get size() {
            return max - min + 1;
        },
        span(): [number, number] {
            return [min, max + 1];
        },
    };
};

type minmax = ReturnType<typeof minmax>;


const grid = (X: minmax, Y: minmax) => {
    const G = new Uint8Array(X.size * Y.size);
    // Displacement & Hashing
    const zx = X.min;
    const zy = Y.min;
    const sx = X.size;
    const P = (x: number, y: number) => (x - zx) + (y - zy) * sx;
    return {
        inc: (x: number, y: number) => G[P(x, y)]++,
        dec: (x: number, y: number) => G[P(x, y)]--,
        get: (x: number, y: number) => G[P(x, y)],
        unwrap: () => G,
    };
};

const Compass = Enum("N", "E", "S", "W", "X");
type Compass = Enum<typeof Compass>;

// Naive spacial hasher
const spatial = () => {
    // x -> y -> count
    const M = new Map<number, Map<number, number>>();

    // Controls
    return {
        inc(x: number, y: number) {
            const R = M.get(x);
            if (R) {
                const V = R.get(y) ?? 0;
                R.set(y, 1 + V);
            } else {
                M.set(x, new Map([[y, 1]]));
            }
        },
        get(x: number, y: number) {
            return M.get(x)?.get(y) ?? 0;
        }
    };
};

export const Part1 = () => {
    // Clone the data
    const D = data.map(({x, y}) => ({x, y, d: Compass.$parse("X")}));
    type Elf = typeof D[number];

    const X = minmax();
    const Y = minmax();

    // Load initial size
    for (const {x, y} of D) {
        X.check(x);
        Y.check(y);
    }

    let pos = grid(X, Y);
    let propose = grid(X, Y);

    // Register positions
    for (const {x, y} of D) {
        pos.inc(x, y);
    }

    // Sanity check
    if (pos.unwrap().includes(2)) {
        throw new Error("Position registered twice");
    }

    type Proposal = (e: Elf) => boolean;
    const check: Proposal[] = [
        // N
        (p) => {
            const L = p.x - 1;
            const H = p.x + 1;
            const y = p.y - 1;
            // Check 3 west cells
            for (let x = L; x <= H; x++) {
                if (pos.get(x, y)) return false;
            }
            // Propose west
            p.d = "N";
            propose.inc(p.x, y);
            return true;
        },
        // E
        (p) => {
            const L = p.y - 1;
            const H = p.y + 1;
            const x = p.x + 1;
            // Check 3 west cells
            for (let y = L; y <= H; y++) {
                if (pos.get(x, y)) return false;
            }
            // Propose west
            p.d = "E";
            propose.inc(x, p.y);
            return true;
        },
        // S
        (p) => {
            const L = p.x - 1;
            const H = p.x + 1;
            const y = p.y + 1;
            // Check 3 west cells
            for (let x = L; x <= H; x++) {
                if (pos.get(x, y)) return false;
            }
            // Propose west
            p.d = "S";
            propose.inc(p.x, y);
            return true;
        },
        // W
        (p) => {
            const L = p.y - 1;
            const H = p.y + 1;
            const x = p.x - 1;
            // Check 3 west cells
            for (let y = L; y <= H; y++) {
                if (pos.get(x, y)) return false;
            }
            // Propose west
            p.d = "W";
            propose.inc(x, p.y);
            return true;
        },
    ];

    for (const e of D) {
        // Check if proposal exists
        const ok = check.find(fn => fn(e));
        // No proposal
        if (!ok) e.d = "X";

        // dbg
        console.log(e);
    }

    return;
};

export const Part2 = () => {
    return;
};


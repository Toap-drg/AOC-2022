import { array, Enum, read, run } from "../utils";

const Blizzard = Enum("<", ">", "v", "^");
type Blizzard = Enum<typeof Blizzard>;

const Input = Enum("#", ".", ...Blizzard.$values);
type Input = Enum<typeof Input>;

const Load = (file: string) => read(file).split("\n").map(
    line => line.split("").map(Input.$parse)
);

const data = Load("src/24/input.txt");
// const data = Load("src/24/sample.txt");

// Board cell, tracking x / y cycles separately
const cell = () => ({
    x: new Set<number>(),
    y: new Set<number>(),
});

/** greates common divisor */
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
/** Least common multiple */
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

type moves = [number, number][];
const m = -1;
const moves_dn: moves = [
    [1, 0],
    [0, 1],
    [0, 0],
    [m, 0],
    [0, m],
];

const moves_up: moves = [
    [m, 0],
    [0, m],
    [0, 0],
    [1, 0],
    [0, 1],
];

let moves = moves_dn;

// Mod lengths (after removing outer walls)
const Y = data.length - 2;
const X = data[0].length - 2;

// Target position
const TX = X - 1;
const TY = Y - 1;

// Max cycle length
// The board repeats after this
const C = lcm(X, Y);

// Board
const board = array(Y, () => array(X, cell));

// Populate board
run(() => {
    // Cyclic index for blizzards
    const $ = (x: number, y: number) => board[y % Y][x % X];

    // Compute blizzard of given direction
    const compute: Record<Blizzard, (x: number, y: number) => void> = {
        "<"(x, y) {
            for (let i = 0; i < X; i++) {
                $(x - i, y).x.add(i);
            }
        },
        ">"(x, y) {
            for (let i = 0; i < X; i++) {
                $(x + i, y).x.add(i);
            }
        },
        "^"(x, y) {
            for (let i = 0; i < Y; i++) {
                $(x, y - i).y.add(i);
            }
        },
        "v"(x, y) {
            for (let i = 0; i < Y; i++) {
                $(x, y + i).y.add(i);
            }
        },
    }

    // Compute all blizzards
    data.forEach((row, y) => row.forEach((type, x) => {
        if (!Blizzard.$check(type)) return;
        // remove padding & gurantee positive
        compute[type](X + x - 1, Y + y - 1);
    }));
});

/** state function */
type D<T> = (x: number, y: number, t: number) => T;

// Get board cell
const closed: D<boolean> = (x, y, t) => {
    // Out of bounds
    if (0 > x || x >= X || 0 > y || y >= Y) {
        // Edge cases for border positions
        const B1 = (x === 0 && y === 0 - 1);
        const B2 = (x === TX && y === Y);
        return !B1 && !B2;
    }
    // Get cell
    const cell = board[y][x];
    // X blizzard
    if (cell.x.has(t % X)) return true;
    // Y blizzard
    if (cell.y.has(t % Y)) return true;
    // Open
    return false;
};

// 3D hash (X * Y * C)
const hash: D<number> = (x, y, t) => {
    // Edge case for initial position
    if (y === -1) y = Y;
    const p = x + (y * X);
    // Positon hash U Time hash
    return (p * C) + (t % C);
};

// Map (state) <=> (arrival time)
const visits = new Map<number, number>();

// Check if first to reach a state
const is_first: D<boolean> = (x, y, t) => {
    const H = hash(x, y, t);
    const hit = visits.get(H);
    const first = !hit || t < hit;
    if (first) visits.set(H, t);
    return first;
};

// Find lowest time
let lowest = Number.MAX_SAFE_INTEGER;

// Initial Target
const target = { x: TX, y: TY };

// Path is at least as slow as the fastest path
const too_slow: D<boolean> = (x, y, time) => {
    const dist = (target.x - x) + (target.y - y);
    return dist + time >= lowest;
};

// Path is at the last possible spot
const is_done: D<boolean> = (x, y, t) => {
    if (x !== target.x || y !== target.y) return false;
    if (t < lowest) lowest = t;
    return true;
};

// Reccursive solver, will set `lowest`
const move: D<void> = (cx, cy, ct) => {

    if (!is_first(cx, cy, ct)) return;

    const nt = ct + 1;

    for (const [dx, dy] of moves) {
        // Check if the current path should retire
        // Means that there is no reason to explore more
        if (too_slow(cx, cy, ct)) return;

        // Construct one possible next state
        const nx = cx + dx;
        const ny = cy + dy;

        // State is valid
        if (closed(nx, ny, nt)) continue;

        // If the state is done,
        // It makes all other possible states worse
        if (is_done(nx, ny, nt)) return;

        // Reccurse
        move(nx, ny, nt);
    }
};

// Reset the solver state
const retarget = (x: number, y: number) => {
    lowest = Number.MAX_SAFE_INTEGER;
    visits.clear();
    target.x = x;
    target.y = y;
};



export const Part1 = () => {

    // Initial state    
    move(0, -1, 0);

    // Lowest time used (+1 for skipped last move)
    return lowest + 1;
};

export const Part2 = () => {
    // Reuse preious resoult
    // [Part1] is assumed to run before this
    const t1 = lowest + 1;
    // Retarget
    retarget(0, 0);
    // Switch move set
    moves = moves_up;
    // Go back to start
    move(TX, Y, t1);
    // Get result
    const t2 = lowest + 1;
    // Retarget
    retarget(TX, TY);
    // Switch move set
    moves = moves_dn;
    // Go back to end
    move(0, 0 - 1, t2);
    // Get result
    const t3 = lowest + 1;
    console.log({ t1, t2, t3 })
    console.log(t1, "=>", t2 - t1, "=>", t3 - t2);
    // Lowest time after all trips
    return t3
};


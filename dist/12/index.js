"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const Load = (file) => {
    const E = new TextEncoder();
    return (0, utils_1.read)(file).split("\n").map(line => E.encode(line));
};
// const data = Load("src/12/sample.txt");
const data = Load("src/12/input.txt");
const X = data.length;
const Y = data[0].length;
/** Iterate all values */
const Iter = (then) => {
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            then(x, y);
        }
    }
};
/** Check if point is inside */
const Ok = ({ x, y }) => (0 <= x && x < X) && (0 <= y && y < Y);
/** Get specific value */
const Get = ({ x, y }) => data[x][y];
/** Start, End & Min, Max Tokens */
const [S, E, A, Z, NONE] = new TextEncoder().encode("SEaz ");
/** Find start | end */
const [start, end] = (() => {
    let s = {};
    let e = {};
    Iter((x, y) => {
        const v = data[x][y];
        if (v === S) {
            s = { x, y };
            data[x][y] = A;
        }
        if (v === E) {
            e = { x, y };
            data[x][y] = Z;
        }
    });
    console.log(S, s);
    console.log(E, e);
    return [s, e];
})();
/** All Directions */
const DS = [0 /* D.D */, 1 /* D.U */, 2 /* D.L */, 3 /* D.R */];
/** Move point in direction */
const Move = ({ x, y }, dir) => {
    switch (dir) {
        case 0 /* D.D */:
            y++;
            break;
        case 1 /* D.U */:
            y--;
            break;
        case 2 /* D.L */:
            x--;
            break;
        case 3 /* D.R */:
            x++;
            break;
    }
    return { x, y };
};
/** Spatial hash */
const Hash = ({ x, y }) => x + y * X;
/** Point equal */
const Eq = (a, b) => (a.x === b.x) && (a.y === b.y);
const Table = (journey) => {
    const grid = data.map(array => new Uint8Array(array.length).fill(NONE));
    let prev = journey;
    while (prev !== undefined) {
        const { x, y } = prev.here;
        grid[x][y] = data[x][y];
        prev = prev.prev;
    }
    {
        const { x, y } = start;
        grid[x][y] = S;
    }
    {
        const { x, y } = end;
        grid[x][y] = E;
    }
    const DE = new TextDecoder();
    const out = grid.map(line => DE.decode(line));
    console.table(out);
};
const Solve = (Q) => {
    // Track initial Journeys
    const map = new Map(Q.map(j => [Hash(j.here), j]));
    // Loop while there is more Journeys
    while (Q.length) {
        const prev = Q.shift();
        const P = prev.here;
        const len = prev.len + 1;
        // Iterate neighbors
        const H = Get(P);
        for (const d of DS) {
            // Check if in grid
            const here = Move(P, d);
            if (!Ok(here))
                continue;
            // Check if in reach (max 1 higher, any lower is ok)
            const h = Get(here);
            const diff = h - H;
            if (diff > 1)
                continue;
            // Check if visited (and longer travel time)
            const hash = Hash(here);
            const hit = map.get(hash);
            if (hit && hit.len <= len)
                continue;
            // Create entry
            const next = {
                prev,
                here,
                len,
            };
            // Add new journey
            map.set(hash, next);
            if (hit) {
                // This journey is faster than the previous
                // Prioritize
                Q.unshift(next);
            }
            else {
                // This is unexplored territory
                // Schedule
                Q.push(next);
            }
        }
    }
    return map.get(Hash(end));
};
const Part1 = () => {
    // Start from starting point
    const last = Solve([{
            len: 0,
            here: start,
        }]);
    Table(last);
    return last.len;
};
exports.Part1 = Part1;
const Part2 = () => {
    const stack = [];
    // Start from any lowest point
    Iter((x, y) => {
        if (data[x][y] === A) {
            stack.push({
                here: { x, y },
                len: 0
            });
        }
    });
    const last = Solve(stack);
    Table(last);
    return last.len;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
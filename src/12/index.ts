import { read } from "../utils";

const Load = (file: string) => {
    const E = new TextEncoder();
    return read(file).split("\n").map(
        line => E.encode(line)
    );
}

// const data = Load("src/12/sample.txt");
const data = Load("src/12/input.txt");

const X = data.length;
const Y = data[0].length;

type P = { x: number; y: number };

/** Iterate all values */
const Iter = (then: (x: number, y: number) => void) => {
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            then(x, y);
        }
    }
}

/** Check if point is inside */
const Ok = ({ x, y }: P) => (0 <= x && x < X) && (0 <= y && y < Y);

/** Get specific value */
const Get = ({ x, y }: P) => data[x][y];

/** Start, End & Min, Max Tokens */
const [S, E, A, Z, NONE] = new TextEncoder().encode("SEaz ");

/** Find start | end */
const [start, end] = (() => {
    let s = {} as P;
    let e = {} as P;
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

/** Direction */
const enum D {
    /** Down */
    D,
    /** Up */
    U,
    /** Left */
    L,
    /** Right */
    R,
}

/** All Directions */
const DS = [D.D, D.U, D.L, D.R];

/** Move point in direction */
const Move = ({ x, y }: P, dir: D): P => {
    switch (dir) {
        case D.D: y++; break;
        case D.U: y--; break;
        case D.L: x--; break;
        case D.R: x++; break;
    }
    return { x, y };
};

/** Spatial hash */
const Hash = ({ x, y }: P) => x + y * X;

/** Point equal */
const Eq = (a: P, b: P) => (a.x === b.x) && (a.y === b.y);

type Journey = {
    len: number;
    prev?: Journey;
    here: P;
};

const Table = (journey: Journey) => {
    const grid = data.map(array => new Uint8Array(array.length).fill(NONE));

    let prev = journey;
    while (prev !== undefined) {
        const { x, y } = prev.here;
        grid[x][y] = data[x][y];
        prev = prev.prev!;
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
}

const Solve = (Q: Journey[]) => {
    // Track initial Journeys
    const map = new Map(Q.map(j => [Hash(j.here), j]));

    // Loop while there is more Journeys
    while (Q.length) {
        const prev = Q.shift()!;
        const P = prev.here;
        const len = prev.len + 1;

        // Iterate neighbors
        const H = Get(P);
        for (const d of DS) {
            // Check if in grid
            const here = Move(P, d);
            if (!Ok(here)) continue;

            // Check if in reach (max 1 higher, any lower is ok)
            const h = Get(here);
            const diff = h - H;
            if (diff > 1) continue;

            // Check if visited (and longer travel time)
            const hash = Hash(here);
            const hit = map.get(hash);
            if (hit && hit.len <= len) continue;

            // Create entry
            const next: Journey = {
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
            } else {
                // This is unexplored territory
                // Schedule
                Q.push(next);
            }
        }
    }

    return map.get(Hash(end))!;
}

export const Part1 = () => {
    // Start from starting point
    const last = Solve([{
        len: 0,
        here: start,
    }]);
    Table(last);
    return last.len;
};

export const Part2 = () => {
    const stack: Journey[] = [];
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
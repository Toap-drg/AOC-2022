import { int, read, sleep } from "../utils";


const enum M {
    Air,
    Sand,
    Ground,
    FallingSand,
}

type P = [number, number];

const MakeGrid = (X: number, Y: number, O: number) => {
    const G = new Uint8Array(Y * X).fill(M.Air);
    return {
        Y,
        X,
        O,
        get: (x: number, y: number) => G[x + y * X] as M,
        set: (x: number, y: number, v: M) => { G[x + y * X] = v; },
        reset: () => {
            for (let i = 0; i < G.length; i++) {
                if (G[i] === M.Sand) G[i] = M.Air;
            }
        },
    };
};

type Grid = ReturnType<typeof MakeGrid>;

const Load = (file: string) => {
    let lx = Number.MAX_SAFE_INTEGER, hx = 0, hy = 0;
    const pair = (str: string): P => {
        const [x, y] = str.split(",").map(int);
        if (x < lx) lx = x;
        if (x > hx) hx = x;
        if (y > hy) hy = y;
        return [x, y];
    };

    // Load lines & calculate grid size
    const grounds = read(file).split('\n').map(line => line.split("->").map(pair));

    // Pad grid
    lx--;
    hx++;
    hy++;

    return { grounds, lx, hx, hy };
};

// Draw method
const draw = (G: Grid, ground: P[]) => {
    for (let i = 1; i < ground.length; i++) {
        // Load points
        let [px, py] = ground[i - 1];
        let [cx, cy] = ground[i];
        // Fix values
        px -= G.O;
        cx -= G.O;
        // Get direction
        if (px === cx) {
            // Draw Y-line
            if (py > cy) [py, cy] = [cy, py];
            for (let y = py; y <= cy; y++) {
                G.set(px, y, M.Ground);
            }
        } else {
            // Draw X-line
            if (px > cx) [px, cx] = [cx, px];
            for (let x = px; x <= cx; x++) {
                G.set(x, py, M.Ground);
            }
        }
    }
};

// This one is much cooler with the animated sample file
// const data = Load("src/14/input.txt");
const data = Load("src/14/sample.txt");
const animate = true;

const T: Record<M, string> = [" ", ".", "#", "+"];

const Frame = async (G: Grid) => {
    // Animate
    if (!animate) return;
    await sleep(50);

    // Build string
    const R = "+" + Array(G.X).fill("-").join("") + "+";
    let out = R + "\n";
    for (let y = 0; y < G.Y; y++) {
        out += "|";
        for (let x = 0; x < G.X; x++) {
            out += T[G.get(x, y)];
        }
        out += "|\n";
    }
    out += R;

    // Display
    console.clear();
    console.log(out);
};


const Sim = async (G: Grid, spawn: number) => {
    G.reset();

    let spawned = 0;
    let px = spawn;
    let py = 0;
    G.set(px, py, M.FallingSand);


    for (; ;) {
        // Maybe animate
        await Frame(G);

        // Clear position
        G.set(px, py, M.Air);

        // Try Fall
        py++;
        if (py >= G.Y) break;
        if (!G.get(px, py)) {
            G.set(px, py, M.FallingSand);
            continue;
        }

        // Try Left
        px--;
        if (px < 0) break;
        if (!G.get(px, py)) {
            G.set(px, py, M.FallingSand);
            continue;
        }

        // Try Right
        px += 2;
        if (px >= G.X) break;
        if (!G.get(px, py)) {
            G.set(px, py, M.FallingSand);
            continue;
        }

        // Resting, spawn a new spec of sand
        G.set(px - 1, py - 1, M.Sand);
        spawned++;
        px = spawn;
        py = 0;
        // Everything is filled
        if (G.get(px, py)) break;
    }

    // Final frame & return count
    await Frame(G);
    return spawned;
};


export const Part1 = () => {
    const { grounds, lx, hx, hy } = data;

    // Grid
    const G = MakeGrid(hx - lx, hy, lx);

    // Draw all ground
    for (const ground of grounds) {
        draw(G, ground);
    }

    // Simulate
    return Sim(G, 500 - G.O);
};

export const Part2 = () => {
    const { grounds, lx, hx, hy } = data;

    const floor = hy + 2;
    const LX = Math.min(500 - floor, lx);
    const HX = Math.max(500 + floor, hx)

    // Grid
    const G = MakeGrid(HX - LX, floor, LX);

    // Draw all ground
    for (const ground of grounds) {
        draw(G, ground);
    }

    const y = floor - 1;
    for (let x = 0; x < G.X; x++) {
        G.set(x, y, M.Ground);
    }

    // Simulate
    return Sim(G, 500 - G.O);
};
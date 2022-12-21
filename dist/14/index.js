"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const MakeGrid = (X, Y, O) => {
    const G = new Uint8Array(Y * X).fill(0 /* M.Air */);
    return {
        Y,
        X,
        O,
        get: (x, y) => G[x + y * X],
        set: (x, y, v) => { G[x + y * X] = v; },
        reset: () => {
            for (let i = 0; i < G.length; i++) {
                if (G[i] === 1 /* M.Sand */)
                    G[i] = 0 /* M.Air */;
            }
        },
    };
};
const Load = (file) => {
    let lx = Number.MAX_SAFE_INTEGER, hx = 0, hy = 0;
    const pair = (str) => {
        const [x, y] = str.split(",").map(utils_1.int);
        if (x < lx)
            lx = x;
        if (x > hx)
            hx = x;
        if (y > hy)
            hy = y;
        return [x, y];
    };
    // Load lines & calculate grid size
    const grounds = (0, utils_1.read)(file).split('\n').map(line => line.split("->").map(pair));
    // Pad grid
    lx--;
    hx++;
    hy++;
    return { grounds, lx, hx, hy };
};
// Draw method
const draw = (G, ground) => {
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
            if (py > cy)
                [py, cy] = [cy, py];
            for (let y = py; y <= cy; y++) {
                G.set(px, y, 2 /* M.Ground */);
            }
        }
        else {
            // Draw X-line
            if (px > cx)
                [px, cx] = [cx, px];
            for (let x = px; x <= cx; x++) {
                G.set(x, py, 2 /* M.Ground */);
            }
        }
    }
};
// This one is much cooler with the animated sample file
// const data = Load("src/14/input.txt");
const data = Load("src/14/sample.txt");
const animate = true;
const T = [" ", ".", "#", "+"];
const Frame = async (G) => {
    // Animate
    if (!animate)
        return;
    await (0, utils_1.sleep)(50);
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
const Sim = async (G, spawn) => {
    G.reset();
    let spawned = 0;
    let px = spawn;
    let py = 0;
    G.set(px, py, 3 /* M.FallingSand */);
    for (;;) {
        // Maybe animate
        await Frame(G);
        // Clear position
        G.set(px, py, 0 /* M.Air */);
        // Try Fall
        py++;
        if (py >= G.Y)
            break;
        if (!G.get(px, py)) {
            G.set(px, py, 3 /* M.FallingSand */);
            continue;
        }
        // Try Left
        px--;
        if (px < 0)
            break;
        if (!G.get(px, py)) {
            G.set(px, py, 3 /* M.FallingSand */);
            continue;
        }
        // Try Right
        px += 2;
        if (px >= G.X)
            break;
        if (!G.get(px, py)) {
            G.set(px, py, 3 /* M.FallingSand */);
            continue;
        }
        // Resting, spawn a new spec of sand
        G.set(px - 1, py - 1, 1 /* M.Sand */);
        spawned++;
        px = spawn;
        py = 0;
        // Everything is filled
        if (G.get(px, py))
            break;
    }
    // Final frame & return count
    await Frame(G);
    return spawned;
};
const Part1 = () => {
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
exports.Part1 = Part1;
const Part2 = () => {
    const { grounds, lx, hx, hy } = data;
    const floor = hy + 2;
    const LX = Math.min(500 - floor, lx);
    const HX = Math.max(500 + floor, hx);
    // Grid
    const G = MakeGrid(HX - LX, floor, LX);
    // Draw all ground
    for (const ground of grounds) {
        draw(G, ground);
    }
    const y = floor - 1;
    for (let x = 0; x < G.X; x++) {
        G.set(x, y, 2 /* M.Ground */);
    }
    // Simulate
    return Sim(G, 500 - G.O);
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
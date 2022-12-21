"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = exports.BadVersion = void 0;
const utils_1 = require("../utils");
// Remember to go throught smaller examples
// let input = "30373\n25512\n65332\n33549\n35390"
const data = (0, utils_1.read)("src/8/input.txt").split("\n").map(row => row.split("").map(v => parseInt(v)));
// console.table(data);
const width = data.length;
const height = data[0].length;
const Empty = (size) => Array(size).fill(-1);
const Spiral = (sx, sy, then) => {
    let lx = 0, x = 0, hx = sx - 1, ly = 0, y = 0, hy = sy - 1;
    let dir = 0 /* S.L */;
    // First row is consumed immediately
    ly += 1;
    while (lx <= hx || ly <= hy) {
        // Yield state
        then(x, y, dir);
        // Next state
        switch (dir) {
            // Step left
            case 0 /* S.L */:
                {
                    x += 1;
                    if (x == hx) {
                        hx -= 1;
                        dir = 1 /* S.D */;
                    }
                }
                break;
            // Step down
            case 1 /* S.D */:
                {
                    y += 1;
                    if (y == hy) {
                        hy -= 1;
                        dir = 2 /* S.R */;
                    }
                }
                break;
            // Step right
            case 2 /* S.R */:
                {
                    x -= 1;
                    if (x == lx) {
                        lx += 1;
                        dir = 3 /* S.U */;
                    }
                }
                break;
            // Step up
            case 3 /* S.U */:
                {
                    y -= 1;
                    if (y == ly) {
                        ly += 1;
                        dir = 0 /* S.L */;
                    }
                }
                break;
        }
    }
    // Yield final state
    then(x, y, dir);
};
const Get = (x, y) => data[x][y];
const Hash = (x, y) => x + y * width;
const BadVersion = () => {
    const horizon = {
        [0 /* S.L */]: Empty(height),
        [1 /* S.D */]: Empty(width),
        [2 /* S.R */]: Empty(height),
        [3 /* S.U */]: Empty(width),
    };
    const idx = {
        [0 /* S.L */]: (x, y) => x,
        [1 /* S.D */]: (x, y) => y,
        [2 /* S.R */]: (x, y) => x,
        [3 /* S.U */]: (x, y) => y,
    };
    let total = 0;
    Spiral(width, height, (x, y, d) => {
        // Get horizon
        let H = horizon[d];
        // Get horizon axis
        let I = idx[d](x, y);
        // Get tree height
        let V = Get(x, y);
        // Check if tree is taller than previous
        if (H[I] < V) {
            total += 1;
            H[I] = V;
        }
    });
    return total;
};
exports.BadVersion = BadVersion;
const iter2 = (sx, sy, then) => {
    for (let x = 0; x < sx; x++)
        for (let y = 0; y < sy; y++)
            then(x, y);
};
const hidden = new Set();
const add = (x, y) => hidden.add(Hash(x, y));
{
    const X = Empty(width);
    const Y = Empty(height);
    iter2(width, height, (x, y) => {
        // Check if visible
        const V = Get(x, y);
        if (X[x] < V) {
            X[x] = V;
            add(x, y);
        }
        if (Y[y] < V) {
            Y[y] = V;
            add(x, y);
        }
    });
}
{
    const X = Empty(width);
    const Y = Empty(height);
    iter2(width, height, (x, y) => {
        // Backwards
        x = width - x - 1;
        y = height - y - 1;
        // Check if visible
        const V = Get(x, y);
        if (X[x] < V) {
            X[x] = V;
            add(x, y);
        }
        if (Y[y] < V) {
            Y[y] = V;
            add(x, y);
        }
    });
}
const Part1 = () => {
    return hidden.size;
};
exports.Part1 = Part1;
const Part2 = () => {
    let max_score = 0;
    /*
    for (const hash of hidden) {
        let x = (hash % width) >>> 0;
        let y = (hash / width) >>> 0;
        */
    iter2(width, height, (x, y) => {
        const V = Get(x, y);
        const score = [];
        { // UP
            let p = y;
            while (p > 0 && Get(x, --p) < V)
                ;
            score.push(y - p);
        }
        { // LEFT
            let p = x;
            while (p < width - 1 && Get(++p, y) < V)
                ;
            score.push(p - x);
        }
        { // DOWN
            let p = y;
            while (p < height - 1 && Get(x, ++p) < V)
                ;
            score.push(p - y);
        }
        { // RIGHT
            let p = x;
            while (p > 0 && Get(--p, y) < V)
                ;
            score.push(x - p);
        }
        let total = score.reduce((p, v) => p * v, 1);
        if (total > max_score) {
            max_score = total;
        }
    });
    return max_score;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const Load = (file) => (0, utils_1.read)(file).split("\n").map(line => {
    const [x, y, z] = line.split(",");
    return [x, y, z].map(utils_1.int);
});
const data = Load("src/18/input.txt");
// const data = Load("src/18/sample.txt");
const Shape = (cubes) => {
    let X = 0, Y = 0, Z = 0;
    for (const [x, y, z] of cubes) {
        if (x > X)
            X = x;
        if (y > Y)
            Y = y;
        if (z > Z)
            Z = z;
    }
    return [X + 1, Y + 1, Z + 1];
};
// Surface of Voxels
const Part1 = () => {
    const [X, Y, Z] = Shape(data);
    console.log("Shape:", { X, Y, Z });
    // Cube => 0
    // Inside => 1
    // Outside => 2
    const V = (0, utils_1.array)(X, () => (0, utils_1.array)(Y, () => (0, utils_1.array)(Z, () => 1)));
    console.log(V.length, V[0].length, V[0][0].length);
    for (const [x, y, z] of data) {
        V[x][y][z] = 0;
    }
    const $ = (x, y, z) => V[x][y][z];
    const out = (x, y, z) => ((0 > x || x >= X)
        /*  */ || /*   */
            (0 > y || y >= Y)
        /*  */ || /*   */
            (0 > z || z >= Z));
    // Sum up area facing the outside
    let area = 0;
    // Check that the cell is painted to be outside
    const c = (x, y, z) => {
        if (out(x, y, z) || $(x, y, z) === 1)
            area++;
    };
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            for (let z = 0; z < Z; z++) {
                // No cube, skipping ...
                if ($(x, y, z))
                    continue;
                // Checking near cells
                c(x + 1, y, z);
                c(x - 1, y, z);
                c(x, y + 1, z);
                c(x, y - 1, z);
                c(x, y, z + 1);
                c(x, y, z - 1);
            }
        }
    }
    const T = ["#", " ", "."];
    const hed = "\n+" + (0, utils_1.array)(Z, () => "-").join("") + "+\n";
    const str = hed + V.map(a => a.map(b => "|" + b.map(v => T[v]).join("") + "|").join("\n")).join(hed) + hed;
    console.log(str);
    return area;
};
exports.Part1 = Part1;
// Surface of outwards facing Voxels
const Part2 = () => {
    const [X, Y, Z] = Shape(data);
    // Cube => 0
    // Inside => 1
    // Outside => 2
    const V = (0, utils_1.array)(X, () => (0, utils_1.array)(Y, () => (0, utils_1.array)(Z, () => 1)));
    for (const [x, y, z] of data) {
        V[x][y][z] = 0;
    }
    const $ = (x, y, z) => V[x][y][z];
    const out = (x, y, z) => ((0 > x || x >= X)
        /*  */ || /*   */
            (0 > y || y >= Y)
        /*  */ || /*   */
            (0 > z || z >= Z));
    // Paint the outside a specific color
    const Q = (0, utils_1.queue)([0, 0, 0]);
    // Check that coords is in grid and not painted
    const a = (x, y, z) => {
        if (out(x, y, z))
            return;
        if ($(x, y, z) !== 1)
            return;
        // Paint
        V[x][y][z] = 2;
        // Queue
        Q.push([x, y, z]);
    };
    while (Q.size) {
        const [x, y, z] = Q.pop();
        // Checking near cells
        a(x + 1, y, z);
        a(x - 1, y, z);
        a(x, y + 1, z);
        a(x, y - 1, z);
        a(x, y, z + 1);
        a(x, y, z - 1);
    }
    // Sum up area facing the outside
    let area = 0;
    // Check that the cell is painted to be outside
    const c = (x, y, z) => {
        if (out(x, y, z) || $(x, y, z) === 2)
            area++;
    };
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            for (let z = 0; z < Z; z++) {
                // No cube, skipping ...
                if ($(x, y, z))
                    continue;
                // Checking near cells
                c(x + 1, y, z);
                c(x - 1, y, z);
                c(x, y + 1, z);
                c(x, y - 1, z);
                c(x, y, z + 1);
                c(x, y, z - 1);
            }
        }
    }
    const T = ["#", ".", " "];
    const hed = "\n+" + (0, utils_1.array)(Z, () => "-").join("") + "+\n";
    const str = hed + V.map(a => a.map(b => "|" + b.map(v => T[v]).join("") + "|").join("\n")).join(hed) + hed;
    console.log(str);
    return area;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
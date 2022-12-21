"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const Load = (file) => (0, utils_1.read)(file);
const data = Load("src/17/input.txt");
const makeRock = (...mask) => {
    const A = mask.reverse().map(x => [...x].map(v => v === "#")).flat();
    return ({
        w: mask[0].length,
        h: mask.length,
        m: A,
    });
};
const all_rocks = [
    makeRock("####"),
    makeRock(" # ", "###", " # "),
    makeRock("  #", "  #", "###"),
    makeRock("#", "#", "#", "#"),
    makeRock("##", "##"),
];
/** Rock Generator */
const RockGen = () => {
    let i = 0;
    const L = all_rocks.length;
    // Poll next rock
    return {
        id: () => i,
        next: () => {
            const rock = all_rocks[i];
            i = (i + 1) % L;
            return rock;
        },
    };
};
/** Wind Generator */
const WindGen = () => {
    let i = 0;
    const L = data.length;
    const D = [...data].map(v => v === ">" ? 1 : -1);
    // Poll current wind direction
    return {
        id: () => i,
        next: () => {
            const wind = D[i];
            i = (i + 1) % L;
            return wind;
        },
    };
};
/** Scoll board */
const ScrollBoard = (opts) => {
    const { width, height } = opts;
    const row = () => Array(width).fill(false);
    // How much has been scrolled
    let scroll = 0;
    // The board
    const board = Array(height).fill(0).map(row);
    // Text spacer
    const spacer = "+" + Array(width).fill("-").join("") + "+";
    return {
        /** Render the board to a string */
        toString() {
            return board.map(row => "|" + row.map(v => v ? "#" : " ").join("") + "|\n").reverse().join("") + spacer;
        },
        /** Paint rock on the board */
        paint(px, py, rock) {
            py -= scroll;
            let i = 0;
            const R = rock.m;
            const Y = py + rock.h;
            const X = px + rock.w;
            for (let y = py; y < Y; y++) {
                const B = board[y];
                for (let x = px; x < X; x++) {
                    if (R[i++]) {
                        B[x] = true;
                    }
                }
            }
        },
        /** Check if rock fits on the board */
        check(px, py, rock) {
            py -= scroll;
            let i = 0;
            const R = rock.m;
            const Y = py + rock.h;
            const X = px + rock.w;
            for (let y = py; y < Y; y++) {
                const B = board[y];
                for (let x = px; x < X; x++) {
                    if (R[i++] && B[x]) {
                        return false;
                    }
                }
            }
            return true;
        },
        /** Scoll the board */
        scroll(rows) {
            for (let i = 0; i < rows; i++) {
                board.shift();
                scroll++;
                board.push(row());
            }
        },
        /** Dimentions */
        get width() { return width; },
        get height() { return height + scroll; },
    };
};
// Brute force solution
// This code can churn out 1_000_000 landed rocks / second
const Part1 = () => {
    const num_rocks = 2022;
    const wind = WindGen();
    const rocks = RockGen();
    const board = ScrollBoard({
        width: 7,
        height: 50,
    });
    // Rocks left to spawn
    let rest = num_rocks;
    // Initial rock
    let curr = rocks.next();
    // Initial spawn (2, 3)
    let px = 2;
    let py = 3;
    let top = 0;
    const W = board.width;
    while (rest) {
        // Simulate wind
        const D = wind.next();
        px += D;
        if (0 > px || px + curr.w > W || !board.check(px, py, curr)) {
            px -= D;
        }
        // Fall
        py--;
        if (py >= top || py >= 0 && board.check(px, py, curr)) {
            continue;
        }
        py++;
        // Rock is resting, painting & spawning a new rock
        board.paint(px, py, curr);
        //
        // const str = "" + board;
        // console.clear();
        // console.log(str);
        //
        const height = py + curr.h;
        if (height > top) {
            top = height;
        }
        //
        rest--;
        curr = rocks.next();
        px = 2;
        py = 3 + top;
        board.scroll(py + curr.h - board.height);
    }
    return top;
};
exports.Part1 = Part1;
const array = (L, then) => Array(L).fill(0).map(then);
// Cycle detection .... !!!!
// THIS WAS SOOO HARD TO FIGURE OUT
// I HAD TO LOOK AT SOME HINTS TO REALIZE 
// THAT CYCLE DETECTION WAS THE SOLUTION
const Part2 = () => {
    const num_rocks = 1000000000000;
    let bonus = 0;
    const _cache = array(data.length, () => array(all_rocks.length, () => new Map()));
    const cache = () => {
        // Don't care about cycles if already found
        // Ignore all other pieces than "####" as
        // it has the biggest surface area & gurantee correct cycles
        if (bonus > 0 || rid != 3)
            return;
        // Lookup wind-id to see if the entry lined up
        const map = _cache[wid][rid];
        // Check if we are at the same position
        if (map.has(px)) {
            // We have been here before (?)
            // Gamble that it is correct ....
            // Don't care to 'proove' it
            const old = map.get(px);
            // Compute distance gained & rocks used
            const dist = py - old.py;
            const used = old.rest - rest;
            // Figure out how many times we can repeat
            const div = Math.floor(rest / used);
            console.log({ rest, used, div });
            // Accumulate height from repetitions
            rest -= used * div;
            bonus += dist * div;
            // "all ok"
            console.log({ rest, mul: used * div });
        }
        else {
            // Register for future use
            map.set(px, {
                py, rest
            });
        }
    };
    const wind = WindGen();
    const rocks = RockGen();
    const board = ScrollBoard({
        width: 7,
        height: 50,
    });
    // Rocks left to spawn
    let rest = num_rocks;
    // Initial rock
    let rid = rocks.id();
    let R = rocks.next();
    // Cached wind
    let wid = 0;
    let D = 0;
    // Initial spawn (2, 3)
    let px = 2;
    let py = 3;
    let top = 0;
    const W = board.width;
    while (rest > 0) {
        // Simulate wind
        wid = wind.id();
        D = wind.next();
        px += D;
        if (0 > px || px + R.w > W || !board.check(px, py, R)) {
            px -= D; // Blocked from doing this move
        }
        // Fall
        py--;
        if (py >= top || py >= 0 && board.check(px, py, R)) {
            continue; // Not resting on anything
        }
        py++;
        // Rock is resting, painting & spawning a new rock
        board.paint(px, py, R);
        //
        const height = py + R.h;
        if (height > top) {
            top = height;
            // This is a new peak,
            // So we are interested in cycles here
            cache();
        }
        //
        rest--;
        rid = rocks.id();
        R = rocks.next();
        px = 2;
        py = 3 + top;
        board.scroll(py + R.h - board.height);
        if (rest % 1000000 === 0)
            console.log(rest);
    }
    return top + bonus;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
"use strict";
// initial X = 1
// two instructions
// addx V => 2 cycles => X += V
// noop => 1 cycle
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
// Look at X value during execution
// Signal strength => current cycle * X
// @ = 20 + 40 * n
const utils_1 = require("../utils");
// const data = read("src/10/sample.txt").split("\n")
const data = (0, utils_1.read)("src/10/input.txt").split("\n");
const Iter = async (instructions, then) => {
    let X = 1;
    let I = 0;
    for (const line of instructions) {
        I++;
        await then(I, X);
        const [inst, arg] = line.split(" ");
        if (inst == "addx") {
            I++;
            await then(I, X);
            X += (0, utils_1.int)(arg);
        }
    }
};
const Part1 = () => {
    let total = 0;
    Iter(data, (i, x) => {
        // Await 20, 60, 100, ... 20 + 40n
        if ((i - 20) % 40)
            return;
        console.log(`[${i}] ${x} => ${i * x}`);
        total += i * x;
    });
    return total;
};
exports.Part1 = Part1;
const Part2 = async () => {
    // 6 x 40 pixels CRT (u32 was too small)
    const CRT = new BigUint64Array(6);
    // 1 x 3 sprite
    const sprite = 7n;
    // 1 x 1 single pixel
    const pixel = 1n;
    // stringify CRT
    const Str = () => {
        let bar = "+-" + Array(40).fill("--").join("") + "-+";
        let out = bar;
        for (const row of CRT) {
            out += "\n| ";
            // stringify first 40 bits of bigint
            for (let i = 0n; i < 40n; i++) {
                out += (row >> i) & 1n ? "##" : "  ";
            }
            out += " |";
        }
        return out + "\n" + bar;
    };
    // Iterate instructions
    await Iter(data, async (i, x) => {
        const I = i - 1;
        const C = (I / 40) | 0;
        // Position sprite
        const S = sprite << BigInt(x - 1);
        // Position scan line
        const P = pixel << BigInt(I % 40);
        // Emit sprite @ scanline to CRT
        CRT[C] |= S & P;
        // animate display
        console.clear();
        console.log(Str());
        await (0, utils_1.sleep)(25);
    });
    // Return final CRT result
    return " ^ there ^ ";
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const Load = (file) => (0, utils_1.read)(file).split("\n").map(utils_1.int);
const data = Load("src/20/input.txt");
const setup = (data) => [
    data.map((val, idx) => ({ val, idx })),
    data.map((___, idx) => idx),
];
const mixer = (ptrs, nums) => {
    /** Pointer aware setter */
    const set = (idx, num) => {
        nums[idx] = num;
        ptrs[num].idx = idx;
    };
    // Mixing algorithm
    const H = ptrs.length - 1;
    for (const { val, idx } of ptrs) {
        // This value
        const num = nums[idx];
        let stop = (idx + val) % H;
        if (stop < 0)
            stop += H; // Fix js-negative-modulus
        // while (stop > H) stop -= H;
        for (let i = idx; i > stop; i--) {
            set(i, nums[i - 1]);
        }
        for (let i = idx; i < stop; i++) {
            set(i, nums[i + 1]);
        }
        set(stop, num);
    }
};
const unpack = (ptrs, nums) => {
    const L = data.length;
    // [0, 1, 2, 3, 4, 5, 6][7, 8, 9, 10]
    /** Cyclic indexing */
    const mod = (idx) => (idx + L) % L;
    // Points of interest
    const where = [1000, 2000, 3000];
    const base = nums.findIndex(v => ptrs[v].val === 0);
    let total = 0;
    for (const p of where) {
        const idx = mod(p + base);
        const value = ptrs[nums[idx]].val;
        console.log("at:", p, "=>", value);
        total += value;
    }
    return total;
};
const Part1 = () => {
    const [ptrs, nums] = setup(data);
    mixer(ptrs, nums);
    return unpack(ptrs, nums);
};
exports.Part1 = Part1;
const Part2 = () => {
    const KEY = 811589153;
    const [ptrs, nums] = setup(data.map(v => v * KEY));
    for (let i = 0; i < 10; i++)
        mixer(ptrs, nums);
    return unpack(ptrs, nums);
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
import { int, read } from "../utils";

const Load = (file: string) => read(file).split("\n").map(int);

const data = Load("src/20/input.txt");
// const data = Load("src/20/sample.txt");


type Group = { val: number, idx: number };

const setup = (data: number[]): [Group[], number[]] => [
    data.map((val, idx) => ({ val, idx })),
    data.map((___, idx) => idx),
];

const mixer = (ptrs: Group[], nums: number[]) => {
    /** Pointer aware setter */
    const set = (idx: number, num: number) => {
        nums[idx] = num;
        ptrs[num].idx = idx;
    };

    // Mixing algorithm
    const H = ptrs.length - 1;
    for (const { val, idx } of ptrs) {

        // This value
        const num = nums[idx];

        let stop = (idx + val) % H;
        if (stop < 0) stop += H; // Fix js-negative-modulus

        for (let i = idx; i > stop; i--) {
            set(i, nums[i - 1]);
        }
        for (let i = idx; i < stop; i++) {
            set(i, nums[i + 1]);
        }

        set(stop, num);
    }
};

const unpack = (ptrs: Group[], nums: number[]) => {
    // Points of interest
    const where = [1000, 2000, 3000] as const;

    // Find index of 0
    const base = nums.findIndex(v => ptrs[v].val === 0);
    const L = data.length;

    // Sum points of interest
    let total = 0;
    for (const p of where) {
        // Cyclic index
        const idx = (p + base) % L;
        const value = ptrs[nums[idx]].val;
        console.log("at:", p, "=>", value)
        total += value;
    }
    return total;
}

export const Part1 = () => {
    const [ptrs, nums] = setup(data);
    mixer(ptrs, nums);
    return unpack(ptrs, nums);
    // 6712
};

export const Part2 = () => {
    const KEY = 811589153;
    const [ptrs, nums] = setup(data.map(v => v * KEY));
    for (let i = 0; i < 10; i++) mixer(ptrs, nums);
    return unpack(ptrs, nums);
    // 1595584274798
};

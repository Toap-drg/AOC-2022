import { read } from "../utils";

const data = read("src/6/input.txt");


const Scan = (text: string, size: number) => {
    const N = text.length;
    for (let i = 0; i < N; i++) {
        const span = text.substring(i, i + size);
        if (new Set(span).size === size) {
            return i + size;
        }
    }
    return undefined;
};

export const Part1 = () => {
    return Scan(data, 4);
};

export const Part2 = () => {
    return Scan(data, 14);
};
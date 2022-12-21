import { read } from "../utils";

type Pair<T> = [T, T];
type Range = Pair<number>;

const data = read("src/4/input.txt").split("\n").map(
    line => line.split(",").map(
        range => range.split("-").map(
            int => parseInt(int)
        ) as Range
    ) as Pair<Range>
);

const Contains = ([AS, AE]: Range, [BS, BE]: Range) => {
    return (AS <= BS && BE <= AE) || (BS <= AS && AE <= BE);
}

const Outside = ([AS, AE]: Range, [BS, BE]: Range) => {
    return (AS > BE || BS > AE)
}

export const Part1 = () => {
    let total = 0;
    for (const [A, B] of data) {
        total += +Contains(A, B);
    }
    return total;
};

export const Part2 = () => {
    let total = 0;
    for (const [A, B] of data) {
        total += +!Outside(A, B);
    }
    return total;
};


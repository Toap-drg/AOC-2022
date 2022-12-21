import { read } from "../utils";

const data = read("src/1/input.txt").trim();

const CountCalories = (bucket: string) => {
    let total = 0;
    for (const entry of bucket.split("\n")) {
        total += parseInt(entry);
    }
    return total;
}

export const Part1 = () => {
    // get calories per elf
    const buckets = data.split("\n\n").map(CountCalories);
    // Find the max calories
    const max = Math.max(...buckets);
    // answer
    return max;
}

export const Part2 = () => {
    // get calories per elf
    const buckets = data.split("\n\n").map(CountCalories);

    // Sort calories
    buckets.sort((a, b) => a - b);

    // Get top(n) calories
    const top = (i: number) => buckets[buckets.length - i]!;

    // Sum top 3 calories
    const top3 = top(1) + top(2) + top(3);

    // answer
    return top3;
}

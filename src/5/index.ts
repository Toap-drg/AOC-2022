import { read } from "../utils";

const LoadData = () => {
    const [drawing, lines] = read("src/5/input.txt").split("\n\n");

    const [ix, ...rows] = drawing.split("\n").reverse();
    const length = parseInt(ix.substring(ix.length - 3));

    return {
        instructions: lines.split("\n").map(line => {
            const [_move, M, _from, F, _to, T] = line.split(" ");
            return {
                move: parseInt(M),
                from: parseInt(F),
                to: parseInt(T),
            };
        }),
        stack: () => {
            const out: string[][] = [];
            // init stacks
            for (let i = 0; i < length; i++) out.push([]);
            // fill stacks
            for (const row of rows) {
                for (let i = 0; i < length; i++) {
                    const c = row.charAt((i * 4) + 1);
                    if (c !== " ") out[i].push(c)
                }
            }
            // done
            return out;
        },
    };
}

const { instructions, stack } = LoadData();

const DebugStack = (stack: string[][]) => {
    const max = Math.max(...stack.map(s => s.length)) * 2;
    const txt = stack.map(s => s.join("|").padEnd(max, " "));
    console.table(txt);
}

export const Part1 = () => {
    const S = stack();

    for (const { move, from, to } of instructions) {
        const F = S[from - 1];
        const T = S[to - 1];
        for (const c of F.splice(F.length - move, move).reverse()) {
            T.push(c);
        }
    }
    // DebugStack(S)
    // SHMSDGZVC
    return S.map(s => s.pop() ?? "$").join("");
};

export const Part2 = () => {
    const S = stack();

    for (const { move, from, to } of instructions) {
        const F = S[from - 1];
        const T = S[to - 1];
        for (const c of F.splice(F.length - move, move)) {
            T.push(c);
        }
    }
    // DebugStack(S)
    // VRZGHDFBQ
    return S.map(s => s.pop() ?? "$").join("");
};
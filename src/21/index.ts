import { Enum, read } from "../utils";

/** Math operator */
const Op = Enum("+", "-", "*", "/");
type Op = Enum<typeof Op>

/** Calculation */
const calc: Record<Op, (a: number, b: number) => number> = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
};

/** Monkey union */
type Monkey = number | { m1: string, op: Op, m2: string };
const Monkey = {
    num: (monkey: Monkey): monkey is number => typeof monkey === "number",
    /** Eval with numbers */
    eval: (m1: number, op: Op, m2: number): number => calc[op](m1, m2),
};

const Load = (file: string) => {
    const monkeys = new Map<string, Monkey>();
    for (const line of read(file).split("\n")) {
        const [name, eq] = line.split(":").map(t => t.trim());
        const [m1, op, m2] = eq.split(" ").map(t => t.trim());
        // Check if equation <or> number
        if (Op.$check(op)) {
            monkeys.set(name, { m1, op, m2 });
        } else {
            monkeys.set(name, +m1);
        }
    }
    return monkeys;
}

const data = Load("src/21/input.txt");
// const data = Load("src/21/sample.txt");


export const Part1 = () => {
    const V = new Map<string, number>();
    const M = data;

    const load = (name: string) => {
        // Already computed
        if (V.has(name)) return V.get(name)!;
        // Get monkey
        console.log("Loading:", name);
        const monkey = M.get(name)!;
        // If number just return
        if (Monkey.num(monkey)) {
            console.log("Number:", name, "=>", monkey);
            V.set(name, monkey);
            return monkey;
        }
        // Compute
        const { m1, op, m2 } = monkey;
        const value = Monkey.eval(load(m1), op, load(m2));
        console.log("Function:", name, "=>", value);
        V.set(name, value);
        return value;
    };

    // The monkey of interest
    return load("root");
};

export const Part2 = () => {
    // Check if name refers to 'human'
    const Human = "humn";
    const V = new Map<string, number>();
    const M = data;

    const Z = (value: number): value is 0 => isNaN(value as any); // typeof value === "number";

    const load = (name: string) => {
        // Already computed
        if (V.has(name)) return V.get(name)!;

        // If 'human' compute as NaN for now
        if (name === Human) {
            V.set(name, NaN);
            return NaN;
        }

        // Get monkey
        const monkey = M.get(name)!;

        // If number just return
        if (Monkey.num(monkey)) {
            V.set(name, monkey);
            return monkey;
        }

        // Compute
        const { m1, op, m2 } = monkey;
        const value = Monkey.eval(load(m1), op, load(m2));
        V.set(name, value);
        return value;
    };

    /** Invert Operator */
    const I: Record<Op, Op> = {
        "+": "-",
        "-": "+",
        "*": "/",
        "/": "*",
    };

    const resolve = (name: string, target: number): number => {

        // Done, we found the value
        if (name === Human) {
            return target;
        }

        // Load the next equation
        const monkey = M.get(name)!;
        if (Monkey.num(monkey)) throw new Error("Cannot resolve a constant!");
        const { m1, op, m2 } = monkey;

        // Load dependencies
        const v1 = load(m1);
        const v2 = load(m2);
        const ip = I[op];

        // Figure out which part is next
        if (!Z(v1)) {
            /* Edge case 
                +1 = 4 - 3
                -1 = 3 - 4
                4 = +1 + 3
                3 = -1 + 4
            */
            const next = Monkey.eval(op === "-" ? -target : target, ip, v1);
            return resolve(m2, next);
        }

        if (!Z(v2)) {
            const next = Monkey.eval(target, ip, v2);
            return resolve(m1, next);
        }

        throw new Error("Failed to resolve");
    };

    // The monkey of interest
    const root = M.get("root")!;
    if (Monkey.num(root)) throw new Error("Cannot resolve a constant!");
    const { m1, m2 } = root;
    const v1 = load(m1);
    const v2 = load(m2);
    if (!Z(v1)) {
        V.set(Human, resolve(m2, v1));
    }

    if (!Z(v2)) {
        V.set(Human, resolve(m1, v2));
    }

    for (const [name, value] of Array.from(V)) {
        if (isNaN(value)) V.delete(name);
    }

    const l1 = load(m1);
    const l2 = load(m2);
    console.log("Result:", { l1, l2, different: l1 !== l2 });
    return V.get(Human)!;
    // Wrong: 8328390935495n
    // Wrong: 8328390935499.66
};

/*

// Reverse Math operation table

// Commutative (enought)
5 = 10 / 2
2 = 10 / 5
10 = 5 * 2
10 = 5 * 2

// Commutative
6 = 2 * 3
6 = 3 * 2
3 = 6 / 2
2 = 6 / 2

// Commutative
5 = 3 + 2
5 = 2 + 3
3 = 5 - 2
2 = 5 - 3

// The culprit !
+1 = 4 - 3
-1 = 3 - 4
4 = +1 + 3
3 = -1 + 4

*/
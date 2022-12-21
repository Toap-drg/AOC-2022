"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
/*
Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
*/
const AsMonkey = (section) => {
    const [monkey, items, op, test, on_true, on_false] = section.split("\n");
    const take = (str) => str.split(":")[1].trim();
    const S = monkey.indexOf(" ");
    const L = monkey.indexOf(":");
    const M = {
        id: (0, utils_1.int)(monkey.substring(S, L)),
        items: take(items).split(",").map(v => BigInt(v)),
        op: compile(take(op)),
        test: BigInt(take(test).split(" ")[2]),
        on_true: (0, utils_1.int)(take(on_true).split(" ")[3]),
        on_false: (0, utils_1.int)(take(on_false).split(" ")[3]),
    };
    return M;
};
const Op = (0, utils_1.Enum)("+", "*");
const compile = (operation) => {
    const [_1, _2, v1, op, v2] = operation.split(" ");
    const is_int = (str) => !isNaN(+str);
    (0, utils_1.assert)(v1 === "old", "first arg was not 'old'");
    return {
        op: Op.$parse(op),
        val: is_int(v2) ? BigInt(v2) : undefined,
    };
};
const run = (op, old) => {
    const value = op.val ?? old;
    if (op.op === "+") {
        return old + value;
    }
    else {
        return old * value;
    }
};
const data = (0, utils_1.read)("src/11/input.txt").split("\n\n").map(AsMonkey);
// const data = read("src/11/sample.txt").split("\n\n").map(AsMonkey);
const Part1 = () => {
    const items = data.map(m => Array.from(m.items));
    const activity = data.map(_ => 0);
    const L = data.length;
    // Monkey Buisness
    const MonkeyBuisness = (item, monkey) => {
        const { op, test, on_true, on_false } = monkey;
        // Modify item
        const next = run(op, item) / 3n;
        // Pick next monkey
        const id = (next % test) ? on_false : on_true;
        // Throw to monkey
        items[id].push(next);
    };
    // Do one cycle of actions
    const Cycle = () => {
        for (let i = 0; i < L; i++) {
            // get monkey
            const local = items[i];
            const monkey = data[i];
            // track activity
            activity[i] += items[i].length;
            // Do all
            while (local.length) {
                const [item] = local.splice(0, 1);
                MonkeyBuisness(item, monkey);
            }
        }
    };
    // 20 cycles
    for (let i = 0; i < 20; i++) {
        Cycle();
    }
    // Product activity => total monkey buisness
    console.table(activity);
    activity.sort((a, b) => b - a);
    const [a, b] = activity;
    return a * b;
};
exports.Part1 = Part1;
const Part2 = () => {
    // The lesson was to use LeastCommomModulus
    // to destroy the values so that they did ot grow forever
    // AS this keeps all the relevant operations correct
    const product = data.reduce((p, v) => p * v.test, 1n);
    console.log("product:", product);
    const items = data.map(m => Array.from(m.items));
    const activity = data.map(_ => 0);
    const L = data.length;
    // Monkey Buisness
    const MonkeyBuisness = (item, M) => {
        // Modify item 
        let next = run(M.op, item) % product;
        // Pick next monkey
        const id = (next % M.test) ? M.on_false : M.on_true;
        // Throw to monkey
        items[id].push(next);
    };
    // Do one cycle of actions
    const Cycle = () => {
        for (let i = 0; i < L; i++) {
            // get monkey
            const local = items[i];
            const monkey = data[i];
            // track activity
            activity[i] += items[i].length;
            // Do all
            while (local.length) {
                const [item] = local.splice(0, 1);
                MonkeyBuisness(item, monkey);
            }
        }
    };
    // 20 cycles
    for (let i = 1; i <= 10000; i++) {
        Cycle();
    }
    // Product activity => total monkey buisness
    console.table(activity);
    activity.sort((a, b) => b - a);
    const [a, b] = activity;
    return a * b;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
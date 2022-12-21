"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
const Load = (file) => {
    const Oname = "Valve ".length;
    const Otunnels = "tunnels lead to valves ".length;
    return (0, utils_1.read)(file).split("\n").map(line => {
        const [V, T] = line.split(";");
        const [N, R] = V.split("=");
        const name = N.substring(Oname, Oname + 2).trim();
        const rate = (0, utils_1.int)(R);
        const tunnels = T.substring(Otunnels, T.length).split(",").map(x => x.trim());
        // Create
        return { name, rate, tunnels };
    });
};
const data = Load("src/16/input.txt");
// const data = Load("src/16/sample.txt");
const Setup = () => {
    const links = new Map();
    const rates = new Map();
    for (const { name, rate, tunnels } of data) {
        const L = new Map();
        tunnels.forEach(t => L.set(t, 1));
        L.set(name, 0);
        // Register
        links.set(name, L);
        rates.set(name, rate);
    }
    // Compute all links
    for (const name of Array.from(links.keys())) {
        // Setup tunnel stack
        const stack = Array.from(links.get(name).entries());
        const map = new Map();
        // Consume stack
        while (stack.length) {
            const [next, time] = stack.pop();
            // Skip if shorter path is known
            const LH = map.get(next) ?? Number.MAX_SAFE_INTEGER;
            if (LH <= time)
                continue;
            map.set(next, time);
            // Check for linked paths
            const linked = links.get(next)?.entries() ?? [];
            for (const [link, dist] of linked) {
                stack.push([link, time + dist]);
            }
        }
        links.set(name, map);
    }
    // Current targets that will give rewards
    const targets = new Set(Array
        .from(rates)
        .filter(([_, rate]) => !!rate)
        .map(([name, _]) => name));
    return { links, rates, targets };
};
// Start at AA
// 30 minutes
// Scheduling problem
// One minute travel between valves
// One minute to open a valve
// Valve contributes, [flow rate] * [remaining minutes]
const Part1 = () => {
    const { links, rates, targets } = Setup();
    let cur_time = 30;
    let cur_reward = 0;
    let max_reward = 0;
    // Recursive method
    const $ = (from) => {
        // Local state
        const L = links.get(from);
        const T = Array.from(targets);
        // Iterate the current targets
        for (const next of T) {
            if (next === from) {
                console.error("N == F");
                continue;
            }
            // Travel time & turn valve time (1 min)
            const time = L.get(next) + 1;
            const rate = rates.get(next);
            // No time to visit, and turn
            if (cur_time < time)
                continue;
            // Start action
            cur_time -= time;
            // Compute reward
            const reward = rate * cur_time;
            cur_reward += reward;
            // Remove from from targets
            targets.delete(next);
            // Reccurse
            $(next);
            // Add from back to targets
            targets.add(next);
            // Undo action
            cur_time += time;
            cur_reward -= reward;
        }
        // Check if this recursive step proivided the best reward
        if (cur_reward > max_reward) {
            max_reward = cur_reward;
        }
    };
    // Always start at:
    $("AA");
    if (cur_reward !== 0 || cur_time !== 30) {
        console.error("Did not reset!:", { cur_reward, cur_time });
    }
    return max_reward;
};
exports.Part1 = Part1;
const Part2 = () => {
    // An elephant can help out
    const { links, rates, targets } = Setup();
    let max_reward = 0;
    // Recursive method
    const $ = (A, B) => {
        // [PRECONDITION] A.time <= B.time
        // Make sure A is always the next actor
        // Local state
        const L = links.get(A.from);
        const T = Array.from(targets);
        // Iterate the current targets
        for (const from of T) {
            // Travel time & turn valve time (1 min)
            const time = A.time - (L.get(from) + 1);
            // No time to visit, and turn
            if (time <= 0)
                continue;
            // Reward from this action
            const reward = A.reward + (rates.get(from) * time);
            // Remove from from targets
            targets.delete(from);
            // const path = [...A.path, from];
            // The next step for Actor A
            const N = { from, time, reward /*, path */ };
            // Reccurse, depending on precondition
            if (N.time >= B.time) {
                $(N, B);
            }
            if (N.time <= B.time) {
                $(B, N);
            }
            // Add from back to targets
            targets.add(from);
        }
        // Check if this recursive step proivided the best reward
        const total = A.reward + B.reward;
        if (total > max_reward) {
            // console.log(total, "=", A.reward, "+", B.reward);
            // console.table({ A: A.path, B: B.path });
            max_reward = total;
        }
    };
    // Always start at:
    const I = {
        from: "AA",
        time: 26,
        reward: 0,
        // path: [],
    };
    console.info("This solution takes some time...");
    console.info("The search space is huge!");
    $(I, I);
    return max_reward;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
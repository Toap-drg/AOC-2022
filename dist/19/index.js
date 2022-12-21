"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const M = (0, utils_1.Enum)("ore", "clay", "obsidian", "geode");
const extract = (text, map) => {
    const tokens = text.split(" ");
    return M.$map((key) => {
        const I = map[key];
        return I ? (0, utils_1.int)(tokens[I]) : 0;
    });
};
// Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
const Load = (file) => (0, utils_1.read)(file).split("\n").map((line) => {
    const [blueprint, recipies] = line.split(":");
    const [ore, clay, obsidian, geode] = recipies.split(".");
    const id = (0, utils_1.int)(blueprint.split(" ")[1]);
    const costs = {
        ore: extract(ore, { ore: 5 }),
        clay: extract(clay, { ore: 5 }),
        obsidian: extract(obsidian, { ore: 5, clay: 8 }),
        geode: extract(geode, { ore: 5, obsidian: 8 }),
    };
    return { id, costs };
});
const data = Load("src/19/input.txt");
// const data = Load("src/19/sample.txt");
const compute_reward = (TIME, { id, costs }) => {
    // state
    let max_state = {};
    let max_reward = -1;
    const check_state = (state) => {
        const reward = state.ores.geode;
        if (reward > max_reward) {
            max_state = state;
            max_reward = reward;
            console.log(id, reward);
        }
    };
    const target_bot = (bot, state) => {
        // The cost to make this bot
        const cost = costs[bot];
        const { bots, ores, time } = state;
        // Get minimum wait time for resources
        let wait_time = 0;
        for (const o of M.$values) {
            // Needed resources
            const need = cost[o];
            // Make 1 ore per minute per bot
            const make = bots[o];
            // Current inventory
            const has = ores[o];
            // Already fulfilled
            if (has >= need)
                continue;
            // Cannot be fulfilled
            if (make == 0)
                return;
            // Missing resources
            const missing = need - has;
            // Time needed to gather the resources
            const wait = Math.ceil(missing / make);
            // Maximal wait time
            if (wait > wait_time) {
                wait_time = wait;
            }
        }
        // Add 1 munute extra to build the bot
        wait_time += 1;
        // Check if waiting would run out of time
        if (wait_time + time >= TIME) {
            const left = TIME - time;
            // Running out of time
            check_state({
                ores: M.$map(ore => ores[ore] + bots[ore] * left),
                bots: bots,
                time: TIME,
                prev: state,
                prompt: "Ran out of time",
            });
            return;
        }
        // There is more time left
        const S = {
            ores: M.$map(ore => ores[ore] + bots[ore] * wait_time - cost[ore]),
            bots: M.$map(ore => bots[ore] + (ore === bot ? 1 : 0)),
            time: time + wait_time,
            prev: state,
            prompt: `Made a ${bot} miner`,
        };
        const mr = explosive_reward(S);
        // Reccurse
        for (const next of M.$values) {
            target_bot(next, S);
            // Early stop
            if (max_reward >= mr)
                return;
        }
    };
    // Overestimate of possible reward
    const explosive_reward = (S) => {
        const ore = S.ores.geode;
        const bot = S.bots.geode;
        const left = TIME - S.time;
        return (ore + bot * left + left * left - left);
    };
    // Init first state
    const S = {
        // Start with one 'ore' ores
        ores: M.$map(ore => ore === "ore" ? 1 : 0),
        // Start with one 'ore' bot
        bots: M.$map(ore => ore === "ore" ? 1 : 0),
        // Start with all the time (-1)
        time: 1,
    };
    // Do first recursive call(s)
    for (const bot of M.$values) {
        target_bot(bot, S);
    }
    // Debug print
    const dbg = ({ bots, ores, time, prev, prompt }) => {
        if (prev)
            dbg(prev);
        console.log("== Minute", time, "==");
        if (prompt)
            console.log(prompt);
        for (const ore of M.$values) {
            if (!bots[ore])
                continue;
            console.log(bots[ore], ore, "miners. has", ores[ore], ore);
        }
        console.log();
    };
    // Print best stratergy
    dbg(max_state);
    // Sanity check
    if (max_reward < 0)
        throw new Error("negative reward!");
    // Return best result
    return max_reward;
};
const Part1 = () => {
    // Quick exit ...
    const answer = 1365;
    if (answer)
        return answer;
    const TIME = 24; // minutes
    let total = 0;
    for (const blueprint of data) {
        const reward = compute_reward(TIME, blueprint);
        const quality = reward * blueprint.id;
        total += quality;
    }
    return total;
};
exports.Part1 = Part1;
const Part2 = () => {
    // Quick exit ...
    const answer = 4864;
    if (answer)
        return answer;
    const TIME = 32; // minutes
    let total = 1;
    // Only top 3, multiplied together, no quality number
    for (const blueprint of data.slice(0, 3)) {
        total *= compute_reward(TIME, blueprint);
    }
    return total;
};
exports.Part2 = Part2;
//# sourceMappingURL=index.js.map
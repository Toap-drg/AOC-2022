import { int, read } from "../utils";

type Valve = {
    name: string;
    rate: number;
    tunnels: string[];
};

// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
const Load = (file: string) => {
    const Oname = "Valve ".length;
    const Otunnels = "tunnels lead to valves ".length;

    return read(file).split("\n").map(line => {
        const [V, T] = line.split(";");
        const [N, R] = V.split("=");
        const name = N.substring(Oname, Oname + 2).trim();
        const rate = int(R);
        const tunnels = T.substring(Otunnels, T.length).split(",").map(x => x.trim());

        // Create
        return { name, rate, tunnels } as Valve;
    });
};

const data = Load("src/16/input.txt");
// const data = Load("src/16/sample.txt");

const Setup = () => {

    type Links = Map<string, number>;
    const links = new Map<string, Links>();
    const rates = new Map<string, number>();

    for (const { name, rate, tunnels } of data) {
        const L: Links = new Map();
        tunnels.forEach(t => L.set(t, 1));
        L.set(name, 0);

        // Register
        links.set(name, L);
        rates.set(name, rate);
    }

    // Compute all links
    for (const name of Array.from(links.keys())) {
        // Setup tunnel stack
        const stack = Array.from(links.get(name)!.entries());
        const map = new Map();

        // Consume stack
        while (stack.length) {
            const [next, time] = stack.pop()!;

            // Skip if shorter path is known
            const LH = map.get(next) ?? Number.MAX_SAFE_INTEGER;
            if (LH <= time) continue;
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
        .map(([name, _]) => name)
    );

    return { links, rates, targets };
};

// Start at AA
// 30 minutes
// Scheduling problem

// One minute travel between valves
// One minute to open a valve
// Valve contributes, [flow rate] * [remaining minutes]

export const Part1 = () => {

    const { links, rates, targets } = Setup();

    let cur_time = 30;
    let cur_reward = 0;
    let max_reward = 0;

    // Recursive method
    const $ = (from: string) => {

        // Local state
        const L = links.get(from)!;
        const T = Array.from(targets);

        // Iterate the current targets
        for (const next of T) {

            if (next === from) {
                console.error("N == F");
                continue;
            }

            // Travel time & turn valve time (1 min)
            const time = L.get(next)! + 1;
            const rate = rates.get(next)!;

            // No time to visit, and turn
            if (cur_time < time) continue;

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

export const Part2 = () => {

    // An elephant can help out

    const { links, rates, targets } = Setup();

    type Actor = {
        time: number;
        from: string;
        reward: number;
        // path: string[];
    };

    let max_reward = 0;

    // Recursive method
    const $ = (A: Actor, B: Actor) => {
        // [PRECONDITION] A.time <= B.time
        // Make sure A is always the next actor

        // Local state
        const L = links.get(A.from)!;
        const T = Array.from(targets);

        // Iterate the current targets
        for (const from of T) {

            // Travel time & turn valve time (1 min)
            const time = A.time - (L.get(from)! + 1);

            // No time to visit, and turn
            if (time <= 0) continue;

            // Reward from this action
            const reward = A.reward + (rates.get(from)! * time);

            // Remove from from targets
            targets.delete(from);

            // const path = [...A.path, from];

            // The next step for Actor A
            const N: Actor = { from, time, reward /*, path */ };

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
    const I: Actor = {
        from: "AA",
        time: 26, // 30 - 4 for teaching an elephant
        reward: 0,
        // path: [],
    };

    console.info("This solution takes some time...");
    console.info("The search space is huge!");
    $(I, I);

    return max_reward;
};
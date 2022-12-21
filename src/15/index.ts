import { int, read } from "../utils";

type P = { x: number, y: number };
type Pair = {
    sensor: P;
    beacon: P;
};

const Load = (file: string): Pair[] => read(file).split("\n").map(line => {
    // Sensor at x=2, y=18: closest beacon is at x=-2, y=15
    const [_s, _at, sx, sy, _c, _b, _i, _a, bs, by] = (line + ":").split(" ");
    const parse = (v: string) => int(v.substring(2, v.length - 1));
    return {
        sensor: {
            x: parse(sx),
            y: parse(sy),
        },
        beacon: {
            x: parse(bs),
            y: parse(by),
        },
    };
});

const data = Load("src/15/input.txt");
// const data = Load("src/15/sample.txt");

const distance = (a: P, b: P): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const Part1 = () => {
    // Scanline
    // const Y = 10; // sample value
    const Y = 2000000; // input value

    // Collect hits
    const hits = new Set<number>();
    const blocks = new Set<number>();

    for (const { sensor, beacon } of data) {
        const dist = distance(sensor, beacon);
        const { x, y } = sensor;
        // Use y distance
        const away = Math.abs(y - Y);
        const rest = dist - away;
        const low = x - rest;
        const hih = x + rest;
        // console.table({ x, y, dist, away, rest, low, hih, adds: (low <= hih) ? 2 * rest + 1 : 0 });
        // Loop x distance
        for (let i = low; i <= hih; i++) {
            hits.add(i);
        }
        if (beacon.y === Y) {
            blocks.add(beacon.x);
        }
    }

    // Count unique hits
    return hits.size - blocks.size;
};

/** "tuning frequency" */
const tuning = (x: number, y: number) => (BigInt(x) * 4000000n) + BigInt(y);

export const Part2 = () => {
    // X / Y Max
    // const L = 20; // sample value
    const L = 4000000; // input value

    const { min, max, abs } = Math;

    // Compute sensors
    const sensors = data.map(({ sensor, beacon }) => ({
        p: sensor,
        d: distance(sensor, beacon),
    }));

    const check = (x: number, y: number) => (
        (0 <= x && x <= L) &&
        (0 <= y && y <= L) &&
        !sensors.find(({ p, d }) => distance(p, { x, y }) <= d)
    );

    // Find blindspot
    for (const { p, d } of sensors) {
        const dist = d + 1;
        const { x, y } = p;

        const ly = max(y - dist, 0);
        const hy = min(y + dist, L);
        for (let iy = ly; iy <= hy; iy++) {
            const rest = dist - abs(y - iy);
            for (const ix of [max(x - rest, 0), min(x + rest, L)]) {
                if (check(ix, iy)) {
                    console.log({ ix, iy });
                    return tuning(ix, iy);
                }
            }
        }
    }
};
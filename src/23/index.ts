import { Enum, read } from "../utils";
import { Grid, look, move } from "./grid";

const Tok = Enum(".", "#")

type P = { x: number, y: number };

const Load = (file: string) => read(file).split("\n").map(
    (line, y) => line.split("").map(
        (token, x) => Tok.$parse(token) === "#" ? { x, y } : false
    ).filter((v) => v)
).flat() as P[];

// const data = Load("src/23/input.txt");
// const data = Load("src/23/sample.txt");
const data = Load("src/23/small.txt");

const Compass = Enum("N", "E", "S", "W", "X");
type Compass = Enum<typeof Compass>;

const minmax = (data: P[]) => {
    let lx, hx, ly, hy;
    lx = ly = Number.MAX_SAFE_INTEGER;
    hx = hy = Number.MIN_SAFE_INTEGER;
    for (const { x, y } of data) {
        if (x < lx) lx = x;
        if (x > hx) hx = x;
        if (y < ly) ly = y;
        if (y > hy) hy = y;
    }
    return [lx, hx, ly, hy]
};


export const Part1 = () => {
    // Clone the data
    const D = data.map(({ x, y }) => ({ x, y, d: Compass.$parse("X") }));

    const prev = new Grid();
    const next = new Grid();

    // Load initial size
    let [lx, hx, ly, hy] = minmax(D);

    // [INITIAL] N -> S -> W -> E
    const proposals: Exclude<Compass, 'X'>[] = ['N', 'S', 'W', 'E'];

    const register = () => {
        // Clear grid
        prev.reset(lx, hx, ly, hy);

        // Register positions
        for (const { x, y } of D) {
            prev.inc(x, y);
        }

        // Sanity check
        if (prev.unwrap().includes(2)) {
            throw new Error("Position registered twice");
        }
    };

    const ROUNDS = 4 // 10;
    for (let i = 0; i < ROUNDS; i++) {
        // dbg
        console.log({
            X: [lx, hx, hx - lx + 1],
            Y: [ly, hy, hy - ly + 1],
        });

        register();

        // Debug
        console.log(`=== Round ${i} ===` + prev);

        // Clear grid
        next.reset(lx, hx, ly, hy);

        // Let all elves propose their next position
        for (const e of D) {
            const { x, y } = e;

            const X = x;
            const Y = y;
            for (let x = X - 1; x < X + 2; x++) {
                let r = "";
                for (let y = Y - 1; y < Y + 2; y++) {
                    r += prev.get(x, y);
                }
                console.log(r);
            }

            const L = prev.adjecent(x, y);
            console.log({x, y}, "=> " + L.join());

            // Stand still if isolated
            if (!L.includes(1)) {
                e.d = "X";
                continue;
            }

            // Check if one proposal may go throught
            for (const P of proposals) {
                const N = L.slice(...look[P]);
                console.log(P, N);
                // reject if elf in direction
                if (N.includes(1)) continue;
                const [dx, dy] = move[P];
                next.inc(x + dx, y + dy);
                e.d = P;
                break;
            }

            // dbg
            console.log(e);
        }

        console.log("Asks" + next);

        // Shrink bounds
        // X.shrink();
        // Y.shrink();

        // let all elves move & expand bounds
        for (const e of D) {
            // Should not move
            if (e.d === "X") continue;

            // get move
            const [dx, dy] = move[e.d];

            // Cannot move here, more than one is planning it
            if (next.get(e.x + dx, e.y + dy) !== 1) continue;

            // Move
            e.x += dx;
            e.y += dy;

            // Update bounds
            const { x, y } = e;
            /**/ if (y < ly) ly = y;
            else if (x > hx) hx = x;
            else if (y > hy) hy = y;
            else if (x < lx) lx = x;
        }

        // Roll movement
        proposals.push(proposals.shift()!);
    }


    [lx, hx, ly, hy] = minmax(D);

    // Register current positions
    register();

    // Debug
    console.log(`=== Final Round ===` + prev);

    // Count empty spaces
    const count = prev.unwrap().reduce((count, v) => count + (+!v), 0);
    // Remove border
    return count - prev.border();
};

export const Part2 = () => {
    return;
};


import { array, Enum, int, read, run } from "../utils";

const Tile = Enum(".", "#");
type Tile = Enum<typeof Tile>;

const Rot = Enum("R", "L");
type Rot = Enum<typeof Rot>;

type $<T> = T[keyof T];
const Dir = {
    R: 0, // >
    D: 1, // v
    L: 2, // <
    U: 3, // ^
} as const;
type Dir = $<typeof Dir>;

const str: Record<Dir, string> = [">", "v", "<", "^"];

/** Rotation Picker */
const rotate: Record<Rot, Record<Dir, Dir>> = {
    R: [1, 2, 3, 0],
    L: [3, 0, 1, 2],
};

const LoadRows = (str: string) => {
    return str.split("\n").map(line => {
        const L = [...line];
        const I = L.findIndex(c => c !== " ");
        return {
            low: I,
            high: L.length - 1,
            cells: L.slice(I).map(Tile.$parse),
        };
    });
};

const LoadPath = (str: string) => {
    let num = "";
    const out: (Rot | number)[] = [];
    for (const char of str) {
        if (Rot.$check(char)) {
            out.push(int(num), char);
            num = "";
        } else {
            num += char;
        }
    }
    out.push(int(num));
    return out;
};

const Load = (file: string) => {
    const [rows, path] = read(file).split("\n\n");
    return {
        rows: LoadRows(rows),
        path: LoadPath(path),
    };
};

const data = Load("src/22/input.txt");
// const data = Load("src/22/sample.txt");

// Disable printing of progress
const NO_PAINT = true;


// Simple flat edge-warping board
export const Part1 = () => {
    const { rows, path } = data;

    /*
    for (const row of rows) {
        console.log(row.cells.join("").padStart(row.high + 1));
    }
    console.log("path:", ...path);
    */

    // Start top left
    let px = rows[0].low;
    let py = 0;
    let dir: Dir = Dir.R;

    const check = (x: number, y: number) => {
        const R = rows[y];
        return R && R.low <= x && x <= R.high;
    };

    const open = (x: number, y: number) => {
        const R = rows[y];
        const I = x - R.low;
        return R.cells[I] === ".";
    };

    /** Do a step in a direction return true when hitting a wall */
    const step: Record<Dir, () => void> = [
        // R: 0, >
        () => {
            let nx = px + 1;
            // If this moves into the void
            // loop back upwards until outside
            // then step in at that point
            if (!check(nx, py)) {
                nx -= 1;
                while (check(nx, py)) nx -= 1;
                nx += 1;
            }

            // Could not move here!
            // Update px if open
            if (open(nx, py)) px = nx;
        },
        // D: 1, v
        () => {
            let ny = py + 1;
            // If this moves into the void
            // loop back upwards until outside
            // then step in at that point
            if (!check(px, ny)) {
                ny -= 1;
                while (check(px, ny)) ny -= 1;
                ny += 1;
            }

            // Update py if open
            if (open(px, ny)) py = ny;
        },
        // L: 2, <
        () => {
            let nx = px - 1;
            // If this moves into the void
            // loop back upwards until outside
            // then step in at that point
            if (!check(nx, py)) {
                nx += 1;
                while (check(nx, py)) nx += 1;
                nx -= 1;
            }

            // Update px if open
            if (open(nx, py)) px = nx;
        },
        // U: 3, ^
        () => {
            let ny = py - 1;
            // If this moves into the void
            // loop back upwards until outside
            // then step in at that point
            if (!check(px, ny)) {
                ny += 1;
                while (check(px, ny)) ny += 1;
                ny -= 1;
            }

            // Update py if open
            if (open(px, ny)) py = ny;
        },
    ];

    // Navigate
    for (const move of path) {

        // Rotate and go next
        if (Rot.$check(move)) {
            dir = rotate[move][dir];
            continue;
        }

        // Move multiple steps
        const S = step[dir];
        for (let i = 0; i < move; i++) S();
    }

    // Compute Password
    const row = py + 1;
    const col = px + 1;
    // console.log({ row, col, dir });
    return 1000 * row + 4 * col + dir;
};


// OH NO, it's a cube
// Something is slightly wrong, this is unsolved for now
export const Part2 = () => {
    const { rows, path } = data;

    // Check if cell exists
    const check = (x: number, y: number) => {
        const R = rows[y];
        return R && R.low <= x && x <= R.high;
    };

    // Check if cell is open
    const open = (x: number, y: number) => {
        const R = rows[y];
        const I = x - R.low;
        return R.cells[I] === ".";
    };

    // Compute the size of one side of the cube
    const size = run(() => {
        let min = Number.MAX_SAFE_INTEGER;
        for (const row of rows) {
            const size = row.high - row.low;
            if (min > size) min = size;
        }
        // high - low => lenght - 1;
        return min + 1;
    });
    const id = (v: number) => Math.floor(v / size);

    // Compute the size of the macro grid
    const sy = id(rows.length);
    const sx = id(rows.reduce((max, { high }) => high > max ? high : max, 0) + 1);

    // The macro grid (x,y)
    const grid = run(() => {
        // Grid shape
        const grid: number[][] = [];

        // Side id
        let i = 0;
        for (let y = 0; y < sy; y++) {
            const row: number[] = [];
            const Y = y * size;
            for (let x = 0; x < sx; x++) {
                const X = x * size;
                row.push(check(X, Y) ? ++i : 0);
            }
            grid.push(row);
        }
        if (i !== 6) throw new Error("Not exactly 6 sides for the cube!");
        return grid;
    });

    for (const row of grid) {
        console.log(row);
    }

    // Side Type
    type Side = {
        id: number;
        links: Record<Dir, Side> & Side[];
    };

    // Join together the sides of the grid
    const sides = run(() => {
        // Setup side cache
        const VOID = null as unknown as Side;
        const sides = array<Side>(1 + 6, (id) => ({ id, links: [VOID, VOID, VOID, VOID] }));
        sides[0] = VOID;

        // Get <or> VOID
        const g = (x: number, y: number) => sides[grid[x]?.[y]] ?? VOID;

        // Initial linking
        for (let y = 0; y < sy; y++) {
            for (let x = 0; x < sx; x++) {
                const S = g(y, x);
                if (S === VOID) continue;
                const L = S.links;
                L[Dir.R] = g(y, x + 1);
                L[Dir.D] = g(y + 1, x);
                L[Dir.L] = g(y, x - 1);
                L[Dir.U] = g(y - 1, x);
            }
        }


        const next = (dir: Dir) => (dir + 1) % 4 as Dir;
        const prev = (dir: Dir) => (dir + 3) % 4 as Dir;

        // Reverse lookup
        const locate = (A: Side, On: Side) => On.links.indexOf(A) as Dir;

        // Linked check
        const linked = (A: Side, B: Side) => A.links.includes(B);

        // Advanced linking, 2 iterations to cover all linking
        const valid = sides.slice(1);
        for (const S of [...valid, ...valid]) {
            for (let dir = Dir.R; dir <= Dir.U; dir++) {
                const A = S.links[next(dir)];
                const B = S.links[dir];
                // Unable to infer link <or> already linked
                if (A === VOID || B === VOID || linked(A, B)) continue;
                // Link based on reverse lookup rotated towards other
                A.links[next(locate(S, A))] = B;
                B.links[prev(locate(S, B))] = A;
            }
        }

        // All should be set up
        return sides;
    });

    // The 'void' side
    const VOID = sides[0];

    // Get the side @ (x, y)
    const side = (x: number, y: number) => sides[grid[id(y)][id(x)]];

    // Get the entry direction when entering a side
    const entry_dir = (from: Side, to: Side) => (to.links.indexOf(from) + 2) % 4 as Dir;

    const S = size - 1;
    // Get the offset from a Side
    const offset = (pos: number) => 0 + (pos % size);
    // Get the mirrored offset from a Side
    const mirror = (pos: number) => S - (pos % size);

    // Get (0,0) of Side
    const top_left = (side: Side): [number, number] => {
        const id = side.id;
        let y = -1;
        let x = grid.findIndex(row => {
            y = row.indexOf(id);
            return y !== -1;
        });
        return [y * size, x * size];
    };

    // Start top left
    let px = rows[0].low;
    let py = 0;
    let dir: Dir = Dir.R;

    /** Do a step in a direction return true when hitting a wall */
    const move: Record<Dir, () => [number, number]> = [
        // R: 0, >
        () => [px + 1, py],
        // D: 1, v
        () => [px, py + 1],
        // L: 2, <
        () => [px - 1, py],
        // U: 3, ^
        () => [px, py - 1],
    ];

    const $ = <T>(msg: string, val: T) => {
        console.log(msg);
        return val;
    };

    // Travel (Dir -> Dir -> offset)
    const travel: Record<Dir, Record<Dir, () => [number, number]>> = [
        // R: 0, >
        [
            // R: 0, >
            () => [0, offset(py)], // Identity
            // D: 1, v
            () => [mirror(py), 0],
            // L: 2, <
            () => [S, mirror(py)], // Flipped
            // U: 3, ^
            () => [offset(py), S],
        ],
        // D: 1, v
        [
            // R: 0, >
            () => [0, mirror(px)],
            // D: 1, v
            () => [offset(px), 0], // Identity
            // L: 2, <
            () => [S, offset(px)],
            // U: 3, ^
            () => [mirror(px), S], // Flipped
        ],
        // L: 2, <
        [
            // R: 0, >
            () => [0, mirror(py)], // Flipped
            // D: 1, v
            () => [offset(py), 0],
            // L: 2, <
            () => [S, offset(py)], // Identity
            // U: 3, ^
            () => [mirror(py), S],
        ],
        // U: 3, ^
        [
            // R: 0, >
            () => [0, offset(px)],
            // D: 1, v
            () => [mirror(px), 0], // Flipped
            // L: 2, <
            () => [S, offset(px)],
            // U: 3, ^
            () => [offset(px), S], // Identity
        ],
    ];

    const paint = run(() => {
        if (NO_PAINT) return () => void 0;
        const X = sx * size;
        const board: string[][] = rows.map((R) => array(X, (I) =>
            (R.low <= I && I <= R.high) ? R.cells[I - R.low] : " "
        ));
        return () => {
            board[py][px] = str[dir];
            const S = board.map(row => row.join("")).join("\n");
            console.log("\n" + S + "\n");
        };
    });

    const step = () => {
        // The dir can change even when moving in a straight line
        const [nx, ny] = move[dir]();

        // Check if not void
        if (check(nx, ny)) {
            // Try to move here
            if (open(nx, ny)) {
                paint();
                px = nx;
                py = ny;
            }
        } else {
            // This moves into the void
            // Move around the cube instead
            const from = side(px, py);
            if (from === VOID) {
                console.error({ px, py, dir });
                console.log(id(px), id(py));
                return;
            }
            const to = from.links[dir];
            const entry = entry_dir(from, to);
            const [zx, zy] = top_left(to);
            const [dx, dy] = travel[dir][entry]();
            const nx = zx + dx;
            const ny = zy + dy;
            console.log({ F: from.id, D: str[dir], x: offset(px), y: offset(py) });
            console.log({ T: to.id, D: str[entry], x: offset(nx), y: offset(ny) });
            console.log({ size });
            // Try to move here (we also might get turned around)
            if (open(nx, ny)) {
                paint();
                px = nx;
                py = ny;
                dir = entry;
            }
        }
    }

    // Navigate
    for (const move of path) {

        // Rotate and go next
        if (Rot.$check(move)) {
            dir = rotate[move][dir];
            continue;
        }

        // Move multiple steps
        for (let i = 0; i < move; i++) step();
    }
    // Final paint
    paint();
    for (const row of grid) {
        console.log(row);
    }

    // Compute Password
    const row = py + 1;
    const col = px + 1;
    // console.log({ row, col, dir });
    return 1000 * row + 4 * col + dir;
};
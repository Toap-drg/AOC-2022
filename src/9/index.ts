import { int, read } from "../utils";

type Dir = "L" | "R" | "D" | "U";

const data = read("src/9/input.txt").split("\n").flatMap(moves => {
    const [dir, count] = moves.split(" ");
    return Array(int(count)).fill(dir) as Dir[];
});

type Point = { x: number, y: number };
type Rope = Point[];

/** Create a Rope Simulation of Length {len} */
const Simulation = (len: number) => {
    // Init to [0,0]
    let rope: Rope = Array(len + 1).fill(0).map(_ => ({ x: 0, y: 0 }));
    // Define Update
    const update = (I: number) => {
        if (I === len) return;
        // Get knots
        const H = rope[I];
        const T = rope[I + 1];
        // Compute distance
        const Dx = H.x - T.x;
        const Dy = H.y - T.y;
        // Combine to one move
        const M = Dx + Dy * 10
        // 0x => distance in X direction
        // x0 => distance in Y direction
        switch (M >> 0) {
            // No Movement => no need to update child
            case 0:
            case +1:
            case -1:
            case +10:
            case -10:
            case (-1 + 10):
            case (+1 - 10):
            case (+1 + 10):
            case (-1 - 10):
                return;
            // Move Right
            case +2:
                T.x++;
                break;
            // Move Left
            case -2:
                T.x--;
                break;
            // Move Down
            case +20:
                T.y++;
                break;
            // Move Up
            case -20:
                T.y--;
                break;
            // Move Right Down
            case (+2 + 10):
            case (+1 + 20):
            case (+2 + 20):
                T.x++;
                T.y++;
                break;
            // Move Left Up
            case (-2 - 10):
            case (-1 - 20):
            case (-2 - 20):
                T.x--;
                T.y--;
                break;
            // Move Right Up
            case (+2 - 10):
            case (+1 - 20):
            case (+2 - 20):
                T.x++;
                T.y--;
                break;
            // Move Left Down
            case (-2 + 10):
            case (-1 + 20):
            case (-2 + 20):
                T.x--;
                T.y++;
                break;
            default:
                // Warn on illegal cases
                console.warn("Bad case", M);
                return;
        }
        // Update child
        update(I + 1);
    };
    // Define move
    const H = rope[0];
    const moves: Record<Dir, () => void> = {
        L() { H.x++ },
        R() { H.x-- },
        D() { H.y++ },
        U() { H.y-- },
    };
    // Return state & controls
    return {
        rope,
        move(dir: Dir) {
            moves[dir]();
            update(0);
        },
    }
}


const Str = (rope: Rope) => {
    // Sort
    const lx = rope.reduce((p, { x }) => x < p ? x : p, 0);
    const mx = rope.reduce((p, { x }) => x > p ? x : p, 0);
    const ly = rope.reduce((p, { y }) => y < p ? y : p, 0);
    const my = rope.reduce((p, { y }) => y > p ? y : p, 0);
    // Symbol picker
    let symbol = (x: number, y: number) => {
        const I = rope.findIndex(E => E.x === x && E.y === y);
        if (I === 0) return "H";
        if (I !== -1) return "" + I;
        if (x === 0 && y === 0) return "s";
        return ".";
    }
    // Build
    let out = "";
    for (let y = ly; y <= my; y++) {
        out += "\n"
        for (let x = lx; x <= mx; x++) {
            out += symbol(x, y);
        }
    }
    return out;
};

const TailStr = (tail: Map<number, Set<number>>) => {
    // Sort
    let lx = 0;
    let mx = 0;
    let ly = 0;
    let my = 0;
    for (const [X, YS] of tail) {
        if (X < lx) lx = X;
        if (X > mx) mx = X;
        for (const Y of YS) {
            if (Y < ly) ly = Y;
            if (Y > my) my = Y;
        }
    }
    // Symbol picker
    let symbol = (x: number, y: number) => {
        if (x === 0 && y === 0) return "O";
        if (tail.get(x)?.has(y)) return "#";
        if (x === 0) return "|";
        if (y === 0) return "-";
        return " ";
    }
    // Build
    let out = "";
    for (let y = ly; y <= my; y++) {
        out += "\n"
        for (let x = lx; x <= mx; x++) {
            out += symbol(x, y);
        }
    }
    return out;
}

export const Part1 = () => {
    // Grid hash
    const X = new Map<number, Set<number>>();
    // Simulation
    const S = Simulation(1);
    const T = S.rope[1];
    // Collect Tail positions
    for (const dir of data) {
        S.move(dir);
        const x = T.x;
        if (!X.has(x)) X.set(x, new Set());
        X.get(x)!.add(T.y);
    }
    // Log result
    console.log(TailStr(X));
    // Sum visited spaces
    return [...X.values()].reduce((p, v) => p + v.size, 0);
};

export const Part2 = () => {
    // Grid hash
    const X = new Map<number, Set<number>>();
    // Simulation
    const S = Simulation(9);
    const T = S.rope[9];
    // Collect Tail positions
    for (const dir of data) {
        S.move(dir);
        const x = T.x;
        if (!X.has(x)) X.set(x, new Set());
        X.get(x)!.add(T.y);
    }
    // Log result
    console.log(TailStr(X));
    // Sum visited spaces
    return [...X.values()].reduce((p, v) => p + v.size, 0);
}
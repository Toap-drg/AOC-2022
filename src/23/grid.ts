
const m = -1;
/** Circular offsets
```
    [1][2][3]
    [8]   [4]
    [7][6][5]

    [9]-->[1]
```
*/
const L = [
    [1, m], // NE
    [0, m], // N
    [m, m], // NW
    [m, 0], // W
    [m, 1], // SW
    [0, 1], // S
    [1, 1], // SE
    [1, 0], // E
    [1, m], // NE
] as const;
export const look = {
    N: [0, 3],
    S: [4, 7],
    W: [2, 5],
    E: [6, 9],
} as const;
export const move = {
    N: [0, m],
    S: [0, 1],
    W: [m, 0],
    E: [1, 0],
} as const;


export class Grid {
    // Underlying data
    private G = new Uint8Array(0);
    // Zero offset
    private zx = 0;
    private zy = 0;
    // Grid size
    private sx = 0;
    private sy = 0;
    // calculate index
    private P(x: number, y: number) {
        const { zx, zy, sx } = this;
        return (x + zx) + sx * (y + zy);
    }
    // Clear and reset (auto pad w/ 1)
    public reset(lx: number, hx: number, ly: number, hy: number) {
        // Size calc
        const S = ({ sx, sy }: Grid) => sx * sy;
        // Get old size
        const olds = S(this);
        // Get new zero offset
        this.zx = 1 - lx;
        this.zy = 1 - ly;
        // Get new grid size
        this.sx = 3 - lx + hx;
        this.sy = 3 - ly + hy;
        // Calculate number of cells
        const size = S(this);
        // Replace or reuse array
        if (size > olds) {
            this.G = new Uint8Array(size);
        } else {
            this.G.fill(0);
        }
    }
    // Increment a grid cell
    public inc(x: number, y: number) {
        // console.log("inc", { x, y });
        this.G[this.P(x, y)]++;
    }
    // Get a grid cell
    public get(x: number, y: number) {
        // console.log("get", { x, y });
        return this.G[this.P(x, y)];
    }
    // Get the adjecent cells of a cell
    public adjecent(x: number, y: number) {
        return L.map(([dx, dy]) => this.get(x + dx, y + dy));
    }
    // Get the underlying grid data
    public unwrap() {
        return this.G;
    }
    // Get border size
    public border() {
        const { sx, sy } = this;
        return sx + sx + sy + sy - 4;
    }
    // To string
    public toString(): string {
        let out = "\n";
        const { sx, sy, G } = this;
        for (let y = 0; y < sy; y++) {
            const Y = sx * y;
            for (let x = 0; x < sx; x++) {
                const V = G[Y + x];
                out += V === 0 ? "." : V;
            }
            out += "\n";
        }
        return out;
    }
}
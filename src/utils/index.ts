import * as fs from "fs";
import * as path from "path";

/** Run a function immediately */
export const run = <T>(fn: () => T): T => fn();

/** Utility for reading a file to string */
export const read = (...filepath: string[]) => {
    return fs
        .readFileSync(path.resolve(...filepath))
        .toString()
        .trim()
        .replaceAll("\r", "");
};

/** Assert condition (thows if false) */
export const assert = (value: boolean, text: string) => {
    if (!value) throw new Error("Assert failed: " + text);
}

/** Parse int with exception on NaN */
export const int = (value: string): number => {
    let i = parseInt(value);
    if (isNaN(i)) throw new Error("Bad Integer: " + value);
    return i;
};

/** Parse float with exception on NaN */
export const float = (value: string): number => {
    let i = parseFloat(value);
    if (isNaN(i)) throw new Error("Bad Float: " + value);
    return i;
};

/** Simple array creation */
export const array = <T>(length: number, fill: (idx: number) => T) => (
    Array(length).fill(0).map((_, i) => fill(i))
);

/** Sleep function */
export const sleep = async (ms: number) => (
    new Promise<void>(r => setTimeout(r, ms))
);

type AsMap<T extends ReadonlyArray<string | number>, V> = {
    [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};
type AsKeys<T extends ReadonlyArray<string | number>> = {
    [K in (T extends ReadonlyArray<infer U> ? U : never)]: K
};
const map = <T extends ReadonlyArray<string | number>>(keys: [...T]): AsKeys<T> => {
    const map: any = {}
    for (const key of keys) {
        map[key] = key;
    }
    return map;
};

/** Define enum parser with exception on mismatch */
export const Enum = <T extends ReadonlyArray<string | number>>(...keys: [...T]) => ({
    $values: keys,
    $check: (value: unknown): value is T[number] => keys.includes(value as any),
    $parse: (value: unknown) => {
        if (!keys.includes(value as any)) {
            throw new Error("Bad Enum: " + value);
        }
        return value as T[number];
    },
    $map: <U>(fn: (val: T[number]) => U): AsMap<T, U> => {
        const map: any = {};
        for (const key of keys) {
            map[key] = fn(key);
        }
        return map;
    },
    ...map(keys),
}) as const;

type __enum_t__ = ReturnType<typeof Enum>;
/** Extract enum type of `typeof {enum-definition}` */
export type Enum<T extends __enum_t__> = T["$values"][number];

/** enum test */
() => {
    // Define enum & get type
    const Dir = Enum("U", "D", "L", "R");
    type Dir = Enum<typeof Dir>;
    // use Type & Validator
    const use = (_: Dir) => void 0;
    const dir = Dir.$parse("U");
    // Type check succeeds
    use(dir);
    use(Dir.D);
};


// THIS IMPLEMENTATION IS CURSED ?!
export const queue = <T>(...Q: T[]) => {
    return {
        get size() { return Q.length },
        push: (value: T) => void Q.push(value),
        peek: () => Q[0] as T | undefined,
        pop: () => Q.shift(),
    };
};
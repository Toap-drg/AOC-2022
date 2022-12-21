/** Run a function immediately */
export declare const run: <T>(fn: () => T) => T;
/** Utility for reading a file to string */
export declare const read: (...filepath: string[]) => string;
/** Assert condition (thows if false) */
export declare const assert: (value: boolean, text: string) => void;
/** Parse int with exception on NaN */
export declare const int: (value: string) => number;
/** Parse float with exception on NaN */
export declare const float: (value: string) => number;
/** Simple array creation */
export declare const array: <T>(length: number, fill: (idx: number) => T) => T[];
/** Sleep function */
export declare const sleep: (ms: number) => Promise<void>;
type AsMap<T extends ReadonlyArray<string | number>, V> = {
    [K in (T extends ReadonlyArray<infer U> ? U : never)]: V;
};
type AsKeys<T extends ReadonlyArray<string | number>> = {
    [K in (T extends ReadonlyArray<infer U> ? U : never)]: K;
};
/** Define enum parser with exception on mismatch */
export declare const Enum: <T extends readonly (string | number)[]>(...keys_0: T) => {
    readonly $values: [...T];
    readonly $check: (value: unknown) => value is T[number];
    readonly $parse: (value: unknown) => T[number];
    readonly $map: <U>(fn: (val: T[number]) => U) => AsMap<T, U>;
} & AsKeys<T>;
type __enum_t__ = ReturnType<typeof Enum>;
/** Extract enum type of `typeof {enum-definition}` */
export type Enum<T extends __enum_t__> = T["$values"][number];
export declare const queue: <T>(...Q: T[]) => {
    readonly size: number;
    push: (value: T) => undefined;
    peek: () => T | undefined;
    pop: () => T | undefined;
};
export {};
//# sourceMappingURL=index.d.ts.map
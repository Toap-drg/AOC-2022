"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = exports.Enum = exports.sleep = exports.array = exports.float = exports.int = exports.assert = exports.read = exports.run = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/** Run a function immediately */
const run = (fn) => fn();
exports.run = run;
/** Utility for reading a file to string */
const read = (...filepath) => {
    return fs
        .readFileSync(path.resolve(...filepath))
        .toString()
        .trim()
        .replaceAll("\r", "");
};
exports.read = read;
/** Assert condition (thows if false) */
const assert = (value, text) => {
    if (!value)
        throw new Error("Assert failed: " + text);
};
exports.assert = assert;
/** Parse int with exception on NaN */
const int = (value) => {
    let i = parseInt(value);
    if (isNaN(i))
        throw new Error("Bad Integer: " + value);
    return i;
};
exports.int = int;
/** Parse float with exception on NaN */
const float = (value) => {
    let i = parseFloat(value);
    if (isNaN(i))
        throw new Error("Bad Float: " + value);
    return i;
};
exports.float = float;
/** Simple array creation */
const array = (length, fill) => (Array(length).fill(0).map((_, i) => fill(i)));
exports.array = array;
/** Sleep function */
const sleep = async (ms) => (new Promise(r => setTimeout(r, ms)));
exports.sleep = sleep;
const map = (keys) => {
    const map = {};
    for (const key of keys) {
        map[key] = key;
    }
    return map;
};
/** Define enum parser with exception on mismatch */
const Enum = (...keys) => ({
    $values: keys,
    $check: (value) => keys.includes(value),
    $parse: (value) => {
        if (!keys.includes(value)) {
            throw new Error("Bad Enum: " + value);
        }
        return value;
    },
    $map: (fn) => {
        const map = {};
        for (const key of keys) {
            map[key] = fn(key);
        }
        return map;
    },
    ...map(keys),
});
exports.Enum = Enum;
/** enum test */
() => {
    // Define enum & get type
    const Dir = (0, exports.Enum)("U", "D", "L", "R");
    // use Type & Validator
    const use = (_) => void 0;
    const dir = Dir.$parse("U");
    // Type check succeeds
    use(dir);
    use(Dir.D);
};
// THIS IMPLEMENTATION IS CURSED ?!
const queue = (...Q) => {
    return {
        get size() { return Q.length; },
        push: (value) => void Q.push(value),
        peek: () => Q[0],
        pop: () => Q.shift(),
    };
};
exports.queue = queue;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part2 = exports.Part1 = void 0;
const utils_1 = require("../utils");
const _SIZE_ = Symbol.for("_SIZE_");
const IsFile = (entry) => typeof entry === "number";
const IsDir = (entry) => typeof entry === "object";
const MakeRoot = () => {
    const root = {};
    root[_SIZE_] = 0;
    root["/"] = root;
    return root;
};
const ToRoot = (dir, take) => {
    let curr = dir;
    while (curr !== undefined) {
        take(curr);
        curr = curr[".."];
    }
};
const Load = (input) => {
    const root = MakeRoot();
    let curr = root;
    const mkdir = (name) => {
        curr[name] = {
            "/": root,
            "..": curr,
            [_SIZE_]: 0,
        };
    };
    const touch = (name, size) => {
        curr[name] = size;
        // Update parent directories [this is wrong if the same file is listed twice....]
        ToRoot(curr, dir => dir[_SIZE_] += size);
    };
    const cd = (name) => {
        const next = curr[name];
        if (!IsDir(next))
            throw new Error(`Cannot open: "${name}"`);
        curr = next;
    };
    for (const line of input.split("\n")) {
        const [type, what, ex] = line.split(" ");
        // Command
        if (type === "$") {
            if (what === "cd")
                cd(ex);
        }
        // Directory
        else if (type === "dir") {
            mkdir(what);
        }
        // File
        else {
            touch(what, parseInt(type));
        }
    }
    // Return root dir
    return root;
};
const root = Load((0, utils_1.read)("src/7/input.txt"));
const Iterate = (dir, on) => {
    for (const [name, type] of Object.entries(dir)) {
        if (name == ".." || name == "/")
            continue;
        if (IsFile(type))
            on.file(type, name);
        else
            on.dir(type, name);
    }
};
const Size = (dir) => dir[_SIZE_];
const Name = (dir) => {
    const parent = dir[".."];
    if (!IsDir(parent))
        return "";
    return Object.entries(parent).find(([_, d]) => d === dir)[0];
};
const Tree = (dir, name, indent) => {
    console.log(indent, "/" + name, ":", Size(dir));
    const next = "  " + indent;
    Iterate(dir, {
        dir(dir, name) {
            Tree(dir, name, next);
        },
        file(file, name) {
            console.log(next, "[" + name + "]:", file);
        },
    });
};
const Part1 = () => {
    const max_size = 100000;
    let total = 0;
    const noop = () => 0;
    const find = (dir) => {
        let size = Size(dir);
        if (size < max_size)
            total += size;
        Iterate(dir, { dir: find, file: noop });
    };
    find(root);
    return total;
};
exports.Part1 = Part1;
const Part2 = () => {
    const storage = 70000000;
    const used = Size(root);
    const free = storage - used;
    const target_free = 30000000;
    const min_size = target_free - free;
    let curr = Size(root);
    const noop = () => 0;
    const find = (dir) => {
        let size = Size(dir);
        if (size > min_size && size < curr)
            curr = size;
        Iterate(dir, { dir: find, file: noop });
    };
    find(root);
    return curr;
};
exports.Part2 = Part2;
const Interact = async () => {
    let curr = root;
    let run = true;
    const log = (...msg) => console.log(" ", ...msg);
    const err = (...msg) => console.log("  [error]:", ...msg);
    const cmds = {
        cd(arg) {
            if (!arg)
                return err("no argument!");
            const next = curr[arg];
            if (!IsDir(next))
                return err("not a directory!");
            curr = next;
        },
        ls() {
            Iterate(curr, {
                dir(dir, name) {
                    log("/" + name + " (size=" + Size(dir) + ")");
                },
                file(file, name) {
                    log("[" + name + "] (size=" + file + ")");
                },
            });
        },
        pwd() {
            const path = [];
            ToRoot(curr, dir => path.push(Name(dir)));
            const cwd = path.reverse().join("/");
            log(cwd);
        },
        tree() {
            Tree(curr, Name(curr), "  ");
        },
        quit() {
            log("exiting ...");
            run = false;
        },
    };
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const Ask = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
    const all = "(" + Object.keys(cmds).map(c => '"' + c + '"').join(", ") + ")";
    console.log("Running interactive file system ... \n");
    while (run) {
        const line = await Ask(`/${Name(curr)}: `);
        const [cmd, ...args] = line.split(" ");
        const fn = cmds[cmd];
        if (!fn)
            err("invalid cmd!", all);
        else
            fn(...args);
    }
    rl.close();
};
setTimeout(Interact, 2000);
//# sourceMappingURL=index.js.map
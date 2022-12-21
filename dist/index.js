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
const fs = __importStar(require("fs"));
const utils_1 = require("./utils");
const $ = (fn) => fn();
const input = () => {
    const R = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return {
        ask: (prompt) => new Promise((resolve) => R.question(prompt, resolve)),
        close: () => void R.close(),
    };
};
const run = async (module, key) => {
    const part = module[key];
    if (typeof part !== "function")
        return;
    console.log(key, ":", await part());
};
const title = (day) => {
    try {
        const files = fs.readdirSync(`src/${day}/`);
        return files.find(file => file.startsWith("_ "))?.substring(2);
    }
    catch {
        return undefined;
    }
};
const run_day = async (day) => {
    if (fs.existsSync(`dist/${day}/index.js`)) {
        console.log("Running Day ", day, ":", title(day));
        // Run this day
        const module = require(`./${day}`);
        await run(module, "Part1");
        await run(module, "Part2");
    }
    else {
        console.log("Day does not exist:", day);
        // Figure out what to do
        const I = input();
        const line = await I.ask("Give a title to this day: ");
        I.close();
        await create(day, line);
    }
};
const create = async (day, title) => {
    const dir = `src/${day}/`;
    if (fs.existsSync(dir)) {
        console.log("Day already exists !?");
        return;
    }
    // Create module
    fs.mkdirSync(dir);
    // Create title file
    fs.writeFileSync(dir + "_ " + title, "");
    // Create data files
    fs.writeFileSync(dir + "input.txt", "");
    fs.writeFileSync(dir + "sample.txt", "");
    // Create index.ts
    const text = (0, utils_1.read)("src/utils/template.ts").replaceAll("%day%", "" + day);
    fs.writeFileSync(dir + "index.ts", text);
    // Ready for recompilation
    console.log("Restart to compile the new day!");
};
const list = () => {
    console.log("All days:");
    for (const e in fs.readdirSync("src")) {
        const t = title(e);
        if (!t)
            continue;
        console.log(" - Day", e.padEnd(2), ":", t);
    }
};
// Launch for today
$(async () => {
    const arg = process.argv[2];
    if (arg === "list") {
        list();
    }
    else {
        const day = new Date().getDate();
        run_day(arg || day);
    }
});
//# sourceMappingURL=index.js.map
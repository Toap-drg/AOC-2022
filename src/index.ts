import * as fs from "fs";
import { read } from "./utils";

const $ = <T>(fn: () => T): T => fn();

const input = () => {
    const R = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return {
        ask: (prompt: string) => new Promise<string>((resolve) => R.question(prompt, resolve)),
        close: () => void R.close(),
    };
};

const run = async (module: any, key: string) => {
    const part = module[key];
    if (typeof part !== "function") return;
    console.log(key, ":", await part());
}

const title = (day: number) => {
    try {
        const files = fs.readdirSync(`src/${day}/`);
        return files.find(file => file.startsWith("_ "))?.substring(2);
    } catch {
        return undefined;
    }
};

const run_day = async (day: number) => {
    if (fs.existsSync(`dist/${day}/index.js`)) {
        console.log("Running Day ", day, ":", title(day));
        // Run this day
        const module = require(`./${day}`);
        await run(module, "Part1");
        await run(module, "Part2");

    } else {
        console.log("Day does not exist:", day);
        // Figure out what to do
        const I = input();
        const line = await I.ask("Give a title to this day: ");
        I.close();
        await create(day, line);
    }
};

const create = async (day: number, title: string) => {
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
    const text = read("src/utils/template.ts").replaceAll("%day%", "" + day);
    fs.writeFileSync(dir + "index.ts", text);
    // Ready for recompilation
    console.log("Restart to compile the new day!");
}

const list = () => {
    console.log("All days:");
    for (const e in fs.readdirSync("src")) {
        const t = title(e as any);
        if (!t) continue;
        console.log(" - Day", e.padEnd(2), ":", t);
    }
};

// Launch for today
$(async () => {
    const arg = process.argv[2] as any;
    if (arg === "list") {
        list();
    } else {
        const day = new Date().getDate();
        run_day(arg || day);
    }
});

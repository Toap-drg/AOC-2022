import { assert } from "console";
import { Enum, read } from "../utils";

const Digit = Enum("=", "-", "0", "1", "2");
type Digit = Enum<typeof Digit>;

// Load and validate
const Load = (file: string) => read(file).split("\n").map(
    line => line.split("").map(Digit.$parse).join("")
);

const data = Load("src/25/input.txt");
// const data = Load("src/25/sample.txt");

// snafu to decimal digit lut
const decimal = { "2": +2, "1": +1, "0": 0, "-": -1, "=": -2, } as const;
// decimal to snafu lut
const digit = ["0", "1", "2", "=", "-"] as const;


const SNAFU = {
    /** Decode SNAFU number */
    decode(snafu: string): bigint {
        // Get the digits
        const digits = snafu.split("").reverse();
        let out = 0n;
        let mul = 1n;
        for (const digit of digits) {
            const value = decimal[Digit.$parse(digit)];
            if (value < 0) out -= mul * BigInt(-value);
            else out += mul * BigInt(value);
            mul *= 5n;
        }
        return out;
    },
    /** Encode Decimal number */
    encode(decimal: bigint): string {
        // List of digits
        const digits: Digit[] = [];

        // Compute remainders
        let number = decimal;
        while (number > 0) {
            // remainder to pick digit
            const R = number % 5n;
            digits.push(digit[Number(R)]);
            // rest to get next digits
            number = (number / 5n);
            // Carry for negative decimals
            if (R > 2) number++;
        }

        // Reverse digit order & join to string
        return digits.reverse().join("");
    },
} as const;

tests({
    // [Decimal, SNAFU]
    known: [
        [1n, "1"],
        [2n, "2"],
        [3n, "1="],
        [4n, "1-"],
        [5n, "10"],
        [6n, "11"],
        [7n, "12"],
        [8n, "2="],
        [9n, "2-"],
        [10n, "20"],
        [15n, "1=0"],
        [20n, "1-0"],
        [2022n, "1=11-2"],
        [12345n, "1-0---0"],
        [314159265n, "1121-1110-1=0"],
    ] as const,
}, {
    encode($, { known }) {
        for (const [decimal, snafu] of known) {
            const result = SNAFU.encode(decimal);
            $.assert_eq(result, snafu, `decimal: ${decimal}`);
        }
    },

    decode($, { known }) {
        for (const [decimal, snafu] of known) {
            const result = SNAFU.decode(snafu);
            $.assert_eq(result, decimal, `snafu: ${snafu}`);
        }
    },
});

export const Part1 = () => {
    const value = data.map(SNAFU.decode).reduce((total, v) => total + v, 0n);
    console.log(value);
    return SNAFU.encode(value);
};

export const Part2 = () => {
    return;
};

/** Test utility */
type Utils = {
    /** Assert thruthy */
    assert<T>(truthy: T, msg?: string): void;
    /** Assert equals */
    assert_eq<T>(value: T, expected: T, msg?: string): void;
};
/** Test definition */
type Tests<Setup> = Record<string, ($: Utils, setup: Readonly<Setup>) => void>;
/** Super simple testing framework */
function tests<S, T extends Tests<S>>(setup: S, named: T) {
    // Internal assertion error
    class AssertError extends Error { };
    // Extend setup with utils
    const $: Utils = {
        assert(truthy, msg?) {
            if (truthy) return;
            const err = `(${truthy}) ${msg ?? ''}`;
            throw new AssertError(err);
        },
        assert_eq(value, expected, msg?) {
            if (value === expected) return;
            const err = `(${value}) !== (${expected}) ${msg ?? ''}`;
            throw new AssertError(err);
        },
    };
    // Count results
    let failed = 0;
    let total = 0;
    // Run all tests
    console.log("Running tests");
    for (const name in named) {
        total++;
        try {
            // Run test & catch faults
            process.stdout.write("Running: " + name + " ");
            named[name]($, setup);
            console.log("[SUCCESS]");
        } catch (e) {
            failed++;
            console.log("[FAILED]")
            if (e instanceof AssertError) {
                const cause = e.cause ?? e.stack?.split("\n")[2] ?? '';
                console.error("Assertion Error:", e.message, "\n", cause);
            } else {
                console.error(e);
            }
        }
    }
    // Log results, exit on errors
    if (failed) {
        console.error(`Tests failed: [${failed}/${total}]`);
        process.exit(1);
    } else {
        console.info("All tests succeeded!\n");
    }
}

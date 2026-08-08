import { replaceDeep } from "./replaceDeep.js";

// if JSON.parse, even via replacer will return `undefined` the value will be eaten out, all other values
// are fine, so we can use this symbol to simulate `undefined` when parsing, then replace it in the result if needed
const UNDEFINED = Symbol("undefined");

type CustomDeserializers = {
    [key: string]: (data: string) => unknown;
    s?: never;
    n?: never;
    u?: never;
    l?: never;
    b?: never;
    i?: never;
};

type Options = {
    /**
     * Maximum allowed length (in characters) of a single serialized BigInt value. Set to `Infinity` to disable
     * the limit.
     */
    maxBigIntLength?: number;
};

// Parsing a BigInt from a decimal string takes more than linear time relative to its length - without a limit
// a single huge value in untrusted input could block the event loop for seconds or worse.
// 10k characters parse in a fraction of a millisecond while being far beyond any typical BigInt use.
const DEFAULT_MAX_BIGINT_LENGTH = 10_000;

/**
 * Deserializes a string serialized with `serialize` into a value.
 *
 * You will need to specify deserializers if custom data types are serialized. See `serialize` for more information.
 *
 * @see {@link serialize}.
 *
 * @param serializedString - the serialized string
 * @param customDeserializers - an object with custom deserializers
 * @param options - options, currently only `maxBigIntLength` (default: 10000) - maximum allowed length of a single
 * serialized BigInt value, protects against malicious input blocking the event loop, as BigInt parsing time grows
 * faster than the value length; set to `Infinity` to disable the limit
 */
const deserialize = <T>(
    serializedString: string, customDeserializers?: CustomDeserializers, options?: Options,
): T => {
    const maxBigIntLength = options?.maxBigIntLength ?? DEFAULT_MAX_BIGINT_LENGTH;
    let hasUndefined = false;
    const replacer = (_key: string, value: unknown) => { // eslint-disable-line max-statements
        if (typeof value === "string") {
            if (value.startsWith("s:")) {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return value.slice(2);
            }
            if (value.startsWith("n:")) {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return Number(value.slice(2));
            }
            if (value.startsWith("i:")) {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                const bigIntString = value.slice(2);
                if (bigIntString.length > maxBigIntLength) {
                    throw new Error(
                        `Serialized BigInt length (${bigIntString.length}) exceeds the maximum allowed length `
                        + `(${maxBigIntLength}), use the maxBigIntLength option to raise or disable the limit`,
                    );
                }
                return BigInt(bigIntString);
            }
            if (value === "u:") {
                hasUndefined = true;
                return UNDEFINED;
            }
            if (value === "l:") {
                return null;
            }
            if (value.startsWith("b:")) {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                return value.slice(2) === "1";
            }

            const semiColonIndex = value.indexOf(":");
            const type = value.slice(0, semiColonIndex);
            if (customDeserializers && type in customDeserializers) {
                return customDeserializers[type]!(value.slice(semiColonIndex + 1));
            }

            throw new Error(`Unsupported data type: ${type}`);
        }
        return value;
    };

    const parsed = JSON.parse(serializedString, replacer) as T;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return hasUndefined ? replaceDeep(parsed, UNDEFINED, undefined) : parsed;
};

export { deserialize, deserialize as unserialize };

export type { CustomDeserializers, Options as DeserializeOptions };

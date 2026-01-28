import { deserialize } from "../deserialize.js";
import { BINARY_MARK_BIN, BINARY_MARK_MAP, BINARY_MARK_STRING } from "./const.js";

const NOT_FOUND = -1;
const LAST_CHAR = -1;

type DeserializeArgs = Parameters<typeof deserialize> extends [any, ...infer Rest] ? Rest : never; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Unserialize data from a Buffer serialized with {@link serializeToBuffer}, useful when working with web sockets or
 * other binary protocols. Make sure to understand how {@link deserialize} works before using this function.
 * @param BufferImplementation - Buffer implementation, in browsers use `buffer` npm package
 * and import it from `buffer/`, in Node.js simply pass `Buffer`.
 * @param deserializeArgs - [customDeserializers] - optional arguments if you need to unserialize custom data types,
 * @param rawData - Buffer to unserialize
 * @returns unserialized data
 */
const unserializeFromBuffer = <RT extends any[] = unknown[]>( // eslint-disable-line @typescript-eslint/no-explicit-any,max-statements
    BufferImplementation: typeof Buffer, deserializeArgs: DeserializeArgs, rawData: Buffer | Uint8Array,
): RT => {
    const intData: Uint8Array = rawData instanceof Uint8Array ? rawData : new Uint8Array(rawData);

    if (intData.length === 0) {
        throw new Error("No data to unserialize");
    }

    let startPoint = 0;
    const result = [];

    while (true) {
        const dataSplitPoint = intData.indexOf(0, startPoint); // find null
        if (dataSplitPoint === NOT_FOUND) { // no null found = no data
            break;
        }

        const lengthBytes = BufferImplementation.from(intData.slice(startPoint, dataSplitPoint)).toString("utf8");
        const binaryMark = lengthBytes.slice(LAST_CHAR) as keyof typeof BINARY_MARK_MAP;
        if (!Object.keys(BINARY_MARK_MAP).includes(binaryMark)) {
            throw new Error(`Invalid binary mark: ${binaryMark}`);
        }

        const len = Number(lengthBytes.slice(0, lengthBytes.length - 1));

        const dataStringFrom = dataSplitPoint + 1;
        const dataStringTo = dataStringFrom + len;
        const dataBytes = intData.slice(dataStringFrom, dataStringTo);

        if (binaryMark === BINARY_MARK_BIN) {
            result.push(dataBytes);
        }
        else if (binaryMark === BINARY_MARK_STRING) {
            const stringData = BufferImplementation.from(dataBytes).toString("utf8");
            result.push(stringData);
        }
        else {
            const stringData = BufferImplementation.from(dataBytes).toString("utf8");
            const jsonData = deserialize(stringData, ...deserializeArgs);
            result.push(jsonData);
        }

        startPoint = dataStringTo + 1; // skip separating null
    }

    if (result.length === 0) {
        throw new Error("No data found (no split points)");
    }

    return result as RT;
};

export { unserializeFromBuffer, unserializeFromBuffer as deserializeFromBuffer };

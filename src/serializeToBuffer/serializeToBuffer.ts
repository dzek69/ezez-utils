import { serialize } from "../serialize.js";
import { BINARY_MARK_BIN, BINARY_MARK_JSON, BINARY_MARK_STRING } from "./const.js";

type SerializeArgs = Parameters<typeof serialize> extends [any, ...infer Rest] ? Rest : never; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Serialize any data to a Buffer, useful when working with web sockets or other binary protocols.
 * Make sure to understand how {@link serialize} works before using this function.
 *
 * To make this function work in browsers it accepts a BufferImplementation parameter.
 * To make the serialization customizable it accepts a serializeArgs parameter.
 * It's therefore recommended to first prepare the function with bind, like:
 * @example
 * ```ts
 * import { serializeToBuffer as serializeRaw } from "@ezez/utils";
 * import { Buffer } from "buffer/"; // skip import in Node.js
 *
 * // prepare the function:
 * const serializeToBuffer = serializeRaw.bind(null, Buffer, []); // array is customization params for serialize
 *
 * const serialized = serializeToBuffer("test", 1, { test: "test" });
 * ```
 *
 * Otherwise pass the params each time:
 * ```typescript
 * import { serializeToBuffer as serializeRaw } from "@ezez/utils";
 * const serialized = serializeToBuffer(Buffer, [], "test", 1, { test: "test" });
 * const otherSerialized = serializeToBuffer(Buffer, [], any, other, data);
 * ```
 * @param BufferImplementation - Buffer implementation, in browsers use `buffer` npm package
 * and import it from `buffer/`, in Node.js simply pass `Buffer`.
 * @param serializeArgs - [customSerializers, options] - optional arguments if you need to serialize custom data types,
 * see: {@link serialize}
 * @param args - any data to serialize, can be a Buffer, string or any other data type
 * @returns Buffer - serialized data
 */
const serializeToBuffer = (
    BufferImplementation: typeof Buffer, serializeArgs: SerializeArgs, ...args: unknown[]
): Buffer => {
    const separator = BufferImplementation.from([0x0]);
    type DataType = {
        mark: typeof BINARY_MARK_BIN;
        data: Buffer;
    } | {
        mark: typeof BINARY_MARK_STRING;
        data: string;
    } | {
        mark: typeof BINARY_MARK_JSON;
        data: unknown;
    };

    const convertedArgs = args.map((arg) => {
        if (arg instanceof BufferImplementation) {
            return {
                mark: BINARY_MARK_BIN,
                data: arg,
            } satisfies DataType;
        }
        if (typeof arg === "string") {
            return {
                mark: BINARY_MARK_STRING,
                data: arg,
            } satisfies DataType;
        }
        return {
            mark: BINARY_MARK_JSON,
            data: serialize(arg, ...serializeArgs),
        } satisfies DataType;
    });
    const dataToSend: Buffer[] = [];
    let totalLength = 0;
    convertedArgs.forEach((arg) => {
        const len = String(arg.data.length) + arg.mark;

        dataToSend.push(BufferImplementation.from(len, "utf-8"));
        dataToSend.push(separator);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        dataToSend.push(arg.mark === BINARY_MARK_BIN ? arg.data : BufferImplementation.from(arg.data, "utf-8"));
        dataToSend.push(separator);

        totalLength += len.length + separator.length + arg.data.length + separator.length;
    });

    return BufferImplementation.concat(dataToSend, totalLength);
};

export {
    serializeToBuffer,
};

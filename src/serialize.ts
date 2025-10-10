import { isPlainObject } from "./isPlainObject.js";
import { replaceDeepByFn } from "./replaceDeepByFn.js";
import { sortProps } from "./sortProps.js";
import { DataWrapper } from "./utils/utils.js";

type CustomSerializers = {
    [key: string]: (data: unknown) => (string | null);
    s?: never;
    n?: never;
    u?: never;
    l?: never;
    b?: never;
    i?: never;
};

type Options = {
    sortProps?: boolean;
};

/**
 * Serializes the data into a string. Think of it as a JSON.stringify on steroids.
 * In opposite to JSON.stringify it supports serializing undefined.
 *
 * It also supports custom serializers, which can be used to serialize custom data types. Each value has a prefix which
 * specifies the type of the value, custom serializers is a map of these prefixes to functions which can serialize the
 * value into a string.
 *
 * The extra aim of this function is to produce the same output for "the same" data, regardless of the order of the keys
 * (which is not guaranteed by JS spec, but in practice it is guaranteed by current implementations of all JS engines),
 * so it sorts the keys and when serializing data by default, you can opt-out of this behavior by passing
 * `{ sortProps: false }` as the third argument.
 *
 * @param data - the data to serialize
 * @param customSerializers - an object with custom serializers
 * @param options - options
 */
const serialize = (data: unknown, customSerializers?: CustomSerializers, options?: Options): string => { // eslint-disable-line max-lines-per-function
    const sourceData = Object.keys(customSerializers ?? {}).length
        ? replaceDeepByFn(
            data,
            value => {
                if (["string", "number", "bigint", "undefined", "boolean"].includes(typeof value)) {
                    return false;
                }
                if (value === null || Array.isArray(value)) {
                    return false;
                }
                if (isPlainObject(value)) {
                    return false;
                }

                const serializerKeys = Object.keys(customSerializers ?? {});
                for (const key of serializerKeys) {
                    const serialized = customSerializers![key]!(value);
                    if (typeof serialized === "string") {
                        return true;
                    }
                }
                return false;
            },
            value => new DataWrapper(value),
        )
        : data;
    const replacer = (_key: string, value: unknown) => { // eslint-disable-line max-statements
        if (typeof value === "string") {
            return `s:${value}`;
        }
        if (typeof value === "number") {
            return `n:${value}`;
        }
        if (typeof value === "bigint") {
            return `i:${value}`;
        }
        if (typeof value === "undefined") {
            return "u:";
        }
        if (typeof value === "boolean") {
            return "b:" + (value ? "1" : "");
        }
        if (value === null) {
            return "l:";
        }
        if (Array.isArray(value)) {
            return value as unknown[];
        }
        if (isPlainObject(value)) {
            return value;
        }
        const serializerKeys = Object.keys(customSerializers ?? {});
        for (const key of serializerKeys) {
            const serialized = customSerializers![key]!(value instanceof DataWrapper ? value.data : value);
            if (typeof serialized === "string") {
                return `${key}:${serialized}`;
            }
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (serialized !== null) {
                throw new Error(`Custom serializer for key ${key} returned a non-string value: ${String(serialized)}`);
            }
        }
        if (typeof value === "object") {
            return value;
        }

        throw new Error(`Unsupported data type: ${typeof value}`);
    };

    if (
        sourceData == null
        || typeof sourceData === "string"
        || typeof sourceData === "number"
        || typeof sourceData === "bigint"
        || typeof sourceData === "undefined"
        || typeof sourceData === "boolean"
        || Array.isArray(sourceData)
    ) {
        return JSON.stringify(sourceData, replacer);
    }

    if (!isPlainObject(sourceData)) {
        const serializerKeysGlobal = Object.keys(customSerializers ?? {});
        for (const key of serializerKeysGlobal) {
            const serialized = customSerializers![key]!(
                sourceData instanceof DataWrapper ? sourceData.data : sourceData,
            );
            if (typeof serialized === "string") {
                return `"${key}:${serialized}"`;
            }
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (serialized !== null) {
                throw new Error(`Custom serializer for key ${key} returned a non-string value: ${String(serialized)}`);
            }
        }
    }

    if (typeof sourceData === "object") {
        return JSON.stringify(
            options?.sortProps === false
                ? sourceData
                : sortProps(sourceData as Record<string, unknown>),
            replacer,
        );
    }

    throw new Error(`Unsupported data type: ${typeof sourceData}`);
};

export type { CustomSerializers };
export { serialize };

import { isPlainObject } from "./isPlainObject";

// Assigning to the "__proto__" key via `obj[key] = value` triggers the inherited setter and swaps the object's
// prototype instead of adding a property (a prototype-pollution gadget). `Object.defineProperty` stores it as a plain
// own property instead, keeping the rebuilt object safe. Mirrors lodash's `baseAssignValue`.
const safeAssign = (object: Record<string, unknown>, key: string, value: unknown): void => {
    if (key === "__proto__") {
        Object.defineProperty(object, key, { configurable: true, enumerable: true, value, writable: true });
    }
    else {
        object[key] = value; // eslint-disable-line no-param-reassign
    }
};

type Options = {
    /**
     * If true, the source objects and arrays will be mutated. Default is false.
     */
    mutate?: boolean;
    /**
     * If true, the function will go into instances for replacement. Otherwise, it will only replace properties of plain
     * objects. Default is false.
     * Warning: This option requires `mutate` to be enabled, because we can't clone instances.
     */
    replaceInstancesProps?: boolean;
};

/**
 * Replaces all occurrences of `search` with `value` in `source` object/array. You do comparison by yourself by providing a callback function.
 *
 * Warnings:
 * - By default, it does not mutate the `source`/deep objects/arrays, but it can be enabled with `mutate` option.
 * - By default, it does not go into instances for replacement, only plain objects.
 * - If your instances are cross-referenced, you may end up in an infinite loop.
 *
 * TypeScript users: This is way too dynamic to type properly, therefore, typing assumes the most basic form of
 * replacement where search and value are of the same type. If that's not the case for you - you'll have to typecast.
 *
 * @param source - source object/array/value
 * @param search - value to search for
 * @param replaceWith - value to replace with
 * @param options - optional options
 */
const replaceDeepByFn = <T>( // eslint-disable-line max-statements
    source: T, search: (value: unknown) => boolean, replaceWith: (value: unknown) => unknown, options?: Options,
): T => {
    if (options?.replaceInstancesProps && !options.mutate) {
        throw new Error("`replaceInstancesProps` option requires `mutate` to be enabled");
    }

    const searchResult = search(source);

    if (typeof searchResult !== "boolean") {
        throw new Error("search function must return a boolean");
    }

    if (searchResult) {
        return replaceWith(source) as T;
    }

    if (source == null) {
        return source;
    }

    if (typeof source === "object") {
        if (Array.isArray(source)) {
            if (options?.mutate) {
                for (let i = 0; i < source.length; i++) {
                    // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-unsafe-assignment
                    source[i] = replaceDeepByFn(source[i], search, replaceWith, options);
                }
                return source;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return source.map((item) => replaceDeepByFn(item, search, replaceWith, options)) as unknown as T;
        }

        if (options?.mutate) {
            if (isPlainObject(source) || options.replaceInstancesProps) {
                for (const key of Object.keys(source)) {
                    safeAssign(source as Record<string, unknown>, key, replaceDeepByFn(
                        (source as Record<string, unknown>)[key], search, replaceWith, options,
                    ));
                }
            }

            return source;
        }

        if (isPlainObject(source)) {
            const src = source as Record<string, unknown>;
            return Object.keys(src).reduce<Record<string, unknown>>((acc, key) => {
                safeAssign(acc, key, replaceDeepByFn(src[key], search, replaceWith, options));
                return acc;
            }, {}) as T;
        }
    }

    return source;
};

export {
    replaceDeepByFn,
};

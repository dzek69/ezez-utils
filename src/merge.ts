/**
 * Special value that can be set as a value in an object.
 * If this value is merged with the previous value, the property in a final object will be removed;
 * @see {@link merge}
 */
const UNSET = typeof Symbol !== "undefined" ? Symbol("UNSET") : {};

// Keys that, when assigned via bracket notation, mutate the prototype chain instead of adding a normal property.
// Their presence in untrusted input (e.g. from `JSON.parse`) is treated as an error rather than corrupting the result.
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Merges two objects into one. If the same property is present in both objects, the value from the second object is
 * used.
 */
type MergeTwo<T, U> = {
    [K in keyof T | keyof U]: K extends keyof U
        ? U[K]
        : K extends keyof T
            ? T[K]
            : never;
};

interface Merge {
    <A>(a: A): A;
    <A, B>(a: A, b: B): MergeTwo<A, B>;
    <A, B, C>(a: A, b: B, c: C): MergeTwo<MergeTwo<A, B>, C>;
    <A, B, C, D>(a: A, b: B, c: C, d: D): MergeTwo<MergeTwo<MergeTwo<A, B>, C>, D>;
    <A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): MergeTwo<MergeTwo<MergeTwo<MergeTwo<A, B>, C>, D>, E>;
    <A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): MergeTwo<
        MergeTwo<MergeTwo<MergeTwo<MergeTwo<A, B>, C>, D>, E>, F
    >;
    <A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): MergeTwo<
        MergeTwo<MergeTwo<MergeTwo<MergeTwo<MergeTwo<A, B>, C>, D>, E>, F>, G
    >;
    <A, B, C, D, E, F, G, H>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): MergeTwo<
        MergeTwo<MergeTwo<MergeTwo<MergeTwo<MergeTwo<MergeTwo<A, B>, C>, D>, E>, F>, G>, H
    >;
    <A, B extends object>(a: A, ...args: B[]): unknown;
}

/**
 * Shallow merges given objects into new object. It does not mutate any object given. Allows removing properties as
 * well by assigning special `mergeUNSET` value.
 * @example merge({a: 1}, {b: 2}) // {a: 1, b: 2}
 * @example merge({a: 1}, {a: 2}) // {a: 2}
 * @example merge({a: 1}, {a: mergeUNSET}) // {}
 * @param {...object} args - input objects
 * @returns {*}
 */
const merge: Merge = <MergeCandidate extends object>(...args: MergeCandidate[]) => {
    const nonObjects = args.some(p => {
        const t = typeof p;
        return t === "string" || t === "number" || t === "symbol" || t === "boolean" || t === "function"
            || Array.isArray(p);
    });

    if (nonObjects) {
        throw new TypeError("Only objects are allowed");
    }

    const r: { [key: string]: unknown } = {};
    args.forEach((obj) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        Object.entries(obj || {}).forEach(([key, value]) => {
            if (FORBIDDEN_KEYS.has(key)) {
                // Malformed/malicious input, refuse the whole merge rather than silently dropping a key.
                throw new TypeError(
                    "Object must not contain prototype-polluting keys (__proto__, constructor, prototype)",
                );
            }
            if (value === UNSET) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete r[key];
                return;
            }
            r[key] = value;
        });
    });
    return r;
};

export {
    merge,
    UNSET as mergeUNSET,
};

export type {
    MergeTwo,
};

/**
 * Returns true if passed argument seems to be empty.
 * Nil values are empty.
 * Strings are considered empty when length is 0.
 * Other primitives will throw an error.
 * Objects are considered empty when doesn't have any enumerable & own property.
 * Arrays and array-like objects are considered empty when length value is 0.
 * Map, Set and -like objects are considered empty when size value is 0.
 *
 * @param obj - source value
 * @example isEmpty({}) // true
 * @example isEmpty(100) // throws
 * @example isEmpty([]) // true
 * @example isEmpty([1]) // false
 * @example isEmpty({ length: 5 }) // false
 * @example isEmpty({ length: 0 }) // true
 * @example isEmpty({ size: 0 }) // true
 * @returns is value considered empty
 *
 * @deprecated This function is not needed in a modern, type-safe code and is encouraging bad practices in general.
 */
const isEmpty = (obj: unknown): boolean => {
    if (typeof obj === "string") {
        return !obj.length;
    }
    if (obj == null) {
        return true;
    }
    if (typeof obj !== "object") {
        throw new TypeError("isEmpty cannot be used on primitives");
    }
    if (Array.isArray(obj)) {
        return !Object.keys(obj).length;
    }
    if ("length" in obj && typeof obj.length === "number") {
        return !(obj).length;
    }
    if ("size" in obj && typeof obj.size === "number") {
        return !(obj).size;
    }
    return !Object.keys(obj).length;
};

export { isEmpty };

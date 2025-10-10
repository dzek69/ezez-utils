/**
 * Checks if given value is a plain object. Plain object should be an object that's not an instance of anything.
 * @example isPlainObject({}); // returns true
 * @example isPlainObject(Object.create(null)); // returns true
 * @example isPlainObject(new URL("https://ezez.dev")); // returns false
 * @example isPlainObject([]); // returns false
 * @example isPlainObject(5); // returns false
 * @param value - value to test
 */
const isPlainObject = (value: unknown): boolean => Boolean(
    value
    && typeof value === "object"
    && (
        value.constructor === Object // default constructor
        || !("constructor" in value) // no constructor
        || Object.getOwnPropertyNames(value).includes("constructor") // constructor is set by user
    ),
);

export {
    isPlainObject,
};


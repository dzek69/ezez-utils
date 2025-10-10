/**
 * Add suffix to string if it does not already end with it
 *
 * @example ensureSuffix("hello world", ".") -> "hello world."
 * @example ensureSuffix("hello world.", ".") -> "hello world."
 * @param {string} string - string to add suffix to
 * @param {string} suffix - suffix to add
 */
const ensureSuffix = (string: string, suffix: string): string => {
    if (string.endsWith(suffix)) {
        return string;
    }
    return string + suffix;
};

export {
    ensureSuffix,
};

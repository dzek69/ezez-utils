/**
 * Add prefix to string if it doesn't already have it
 *
 * @example ensurePrefix("1234bbcc", "0x") -> "0x1234bbcc"
 * @example ensurePrefix("0x1234bbcc", "0x") -> "0x1234bbcc"
 * @param {string} string - string to add prefix to
 * @param {string} prefix - prefix to add
 */
const ensurePrefix = (string: string, prefix: string): string => {
    if (string.startsWith(prefix)) {
        return string;
    }
    return prefix + string;
};

export {
    ensurePrefix,
};

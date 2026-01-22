const DEFAULT_SIDE_CHARS_LENGTH = 4;

/**
 * Formats given input string, taking first `sideCharsLength` and last `sideCharsLength` characters,
 * joining them with `separator`. If there is not enough characters, returns the original string.
 * @param hash
 * @param sideCharsLength
 * @param separator
 * @example formatHash("abcdef1234567890") // "abcd…7890"
 */
const formatHash = (hash: string, sideCharsLength: number = DEFAULT_SIDE_CHARS_LENGTH, separator = "…"): string => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (hash.length <= sideCharsLength * 2) {
        return hash;
    }
    const start = hash.slice(0, sideCharsLength);
    const end = hash.slice(-sideCharsLength);
    return `${start}${separator}${end}`;
};

export {
    formatHash,
};


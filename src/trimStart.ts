/**
 * Removes given characters from the start of the string.
 * See also: {@link trim} and {@link trimEnd}.
 *
 * @param source - Source string.
 * @param characters - Characters to remove, taken as a whole.
 *
 * @example
 * trimStart("abbcb", "ab"); // "bcb"
 * trimStart("!!aaa!", "!"); // "aaa!"
 */
const trimStart = (source: string, characters: string): string => {
    let s = source;
    while (s.startsWith(characters)) {
        s = s.slice(characters.length);
    }
    return s;
};

export {
    trimStart,
};

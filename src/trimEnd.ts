/**
 * Removes given characters from the end of the string.
 * See also: {@link trim} and {@link trimStart}.
 *
 * @param source - Source string.
 * @param characters - Characters to remove, taken as a whole.
 *
 * @example
 * trimEnd("abcxzyz", "yz"); // "abcxz"
 * trimEnd("!aaa!!", "!"); // "!aaa"
 */
const trimEnd = (source: string, characters: string): string => {
    let s = source;
    while (s.endsWith(characters)) {
        s = s.slice(0, -characters.length);
    }
    return s;
};

export {
    trimEnd,
};

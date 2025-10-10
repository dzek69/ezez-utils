import { trimEnd } from "./trimEnd.js";
import { trimStart } from "./trimStart.js";

/**
 * Removes given characters from both sides of the string.
 * If you want to remove from one side of the string see {@link trimStart} and {@link trimEnd}.
 *
 * @param source - Source string.
 * @param characters - Characters to remove, taken as a whole.
 *
 * @example
 * trim("abcb", "ab"); // "cb"
 * trim("!aaa!", "!"); // "aaa"
 * trim("!aaa!!!", "!"); // "aaa"
 * trim("!aaa!!!", "!!!"); // "!aaa"
 */
const trim = (source: string, characters: string): string => {
    return trimStart(trimEnd(source, characters), characters);
};

export {
    trim,
};


import { escapeRegExp } from "./escapeRegExp.js";

/**
 * Replaces all occurrences of the keys in the replaceMap with the values.
 * @param source - source string
 * @param replaceMap - keys from this object will be replaced with values in source string
 * @example replace("Hello, %name%!", { "%name%: "John" }) // "Hello, John!"
 * @example replace("Hello, %name%! Nice to meet you %name%!", { "%name%": "Jane" }) // "Hello, Jane! Nice to meet you Jane!"
 */
const replace = (source: string, replaceMap: Record<string, string>): string => {
    const keys = Object.keys(replaceMap);
    if (keys.length === 0) {
        return source;
    }
    const regex = new RegExp(keys.map(escapeRegExp).join("|"), "gu");
    return source.replace(regex, (matched) => replaceMap[matched]!);
};

export {
    replace,
};

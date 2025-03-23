import type { CamelCase } from "type-fest";

const camelCase = <T extends string>(string: T): CamelCase<T> => {
    return string
        .split(/[\s_-]/)
        .filter(Boolean)
        .map((word) => {
            console.log(word, word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("")
        .replace(/^./, (letter) => letter.toLowerCase()) as CamelCase<T>;
};

export {
    camelCase,
};

interface Options {
    /**
     * Allow overlapping matches, ie. "aa" in "aaa" will return 2 instead of 1
     */
    overlap?: boolean;
}

const NOT_FOUND = -1;

/**
 * Count the number of occurrences of a substring in a string
 *
 * @example occurrences("aaa", "a"); // 3
 * @example occurrences("aaaa", "aa", { overlap: false }); // 2
 * @example occurrences("aaaa", "aa", { overlap: true }); // 3
 * @param {string} string - string to search in
 * @param {string} search - string to search for
 * @param {object} [options] - options
 * @param {boolean} [options.overlap=false] - allow overlapping matches, ie "aa" in "aaa" will return 2 instead of 1
 */
const occurrences = (string: string, search: string, { overlap }: Options = {}): number => {
    if (typeof string !== "string") {
        throw new TypeError("Expected a string");
    }
    if (typeof search !== "string") {
        throw new TypeError("Expected a string");
    }
    if (search.length === 0) {
        return 0;
    }
    let n = 0,
        i = 0;

    // eslint-disable-next-line no-constant-condition,@typescript-eslint/no-unnecessary-condition
    while (true) {
        i = string.indexOf(search, i);

        if (i === NOT_FOUND) {
            break;
        }
        n++;
        i += overlap ? 1 : search.length;
    }
    return n;
};

export {
    occurrences,
};

export type {
    Options as OccurencesOptions,
};

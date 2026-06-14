/**
 * Picks a given number of random elements from the array. It won't pick the same element twice (unless the array has
 * duplicates).
 *
 * If the number of elements to pick is greater than the array length, it will return the original array.
 *
 * @param array - source array
 * @param elementsToPick - number of elements to pick
 * @param allowShuffle - if true, it will shuffle the values if elementsToPick is greater or equal to array length instead of returning the original array
 */
const samples = <T>(array: T[], elementsToPick: number, allowShuffle = false): T[] => { // eslint-disable-line max-statements
    if (elementsToPick < 0) {
        throw new Error("elementsToPick must be a positive number");
    }
    if (elementsToPick === 0) {
        return [];
    }

    if (!allowShuffle && elementsToPick >= array.length) {
        return array;
    }

    const keys = Object.keys(array);
    // when shuffling we may be asked for more than we have - never pick more than exists, or we'd
    // run out of keys and pad the result with `undefined`
    const toPick = Math.min(elementsToPick, keys.length);
    let picked = 0;
    const result: T[] = [];

    while (picked < toPick) {
        const indexOfKey = Math.floor(Math.random() * keys.length);
        const indexOfArray = Number(keys[indexOfKey]);
        const element = array[indexOfArray]!;
        result.push(element);
        keys.splice(indexOfKey, 1);
        picked++;
    }

    return result;
};

export {
    samples,
};

/**
 * Finds most frequent value in array
 * @param {Array} array
 */
const mostFrequent = <T>(array: T[]): T | undefined => {
    let top = 0,
        topValue = array[0];

    const map = new Map<T, number>();
    array.forEach(value => {
        const next = (map.get(value) ?? 0) + 1;
        map.set(value, next);
        if (next > top) {
            top = next;
            topValue = value;
        }
    });

    return topValue;
};

export {
    mostFrequent,
};

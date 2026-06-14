/**
 * Changes the scale of given value, i.e.: replaces values from 2.9 to 3.3 into values from 0 to 100. Useful for i.e.:
 * displaying measured battery voltage as a percent value.
 * Pro-tip: use `Function.prototype.bind` to create yourself a function with bound 4 first arguments to re-use without
 * repeating the from-to scale.
 * @param {number} fromMin
 * @param {number} fromMax
 * @param {number} toMin
 * @param {number} toMax
 * @param {number} number
 * @throws {Error} when `fromMin` equals `fromMax` (the source range has zero width)
 */
const scale = (fromMin: number, fromMax: number, toMin: number, toMax: number, number: number): number => {
    if (fromMin === fromMax) {
        throw new Error("[scale] fromMin and fromMax must not be equal");
    }
    return toMin + ((number - fromMin) / (fromMax - fromMin) * (toMax - toMin));
};

export {
    scale,
};

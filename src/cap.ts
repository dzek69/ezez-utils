/**
 * Returns a number capped between an upper and lower limit.
 * @param {number} value - value to cap
 * @param {number} upperLimit - upper limit, inclusive
 * @param {number} [lowerLimit] - lower limit, inclusive
 */
const cap = (value: number, upperLimit: number, lowerLimit?: number): number => {
    if (lowerLimit == null) {
        return Math.min(value, upperLimit);
    }
    if (upperLimit < lowerLimit) {
        throw new TypeError("upperLimit must be greater than lowerLimit");
    }
    return Math.min(upperLimit, Math.max(lowerLimit, value));
};

export {
    cap,
};

/**
 * Rounds a number to a given precision
 *
 * @example
 * round(1.23) // 1
 * round(1.55) // 2
 * round(1.333, 2) // 1.33
 * round(1.2345, 3) // 1.234
 *
 * @param value - value to round
 * @param precision - precision to round to
 */
const round = (value: number, precision?: number): number => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

export {
    round,
};

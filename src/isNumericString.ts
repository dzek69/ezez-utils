interface Options {
    allowFloats?: boolean;
    allowExponents?: boolean;
    allowInfinity?: boolean;
    allowNaN?: boolean;
}

const NOT_FOUND = -1;

/**
 * Checks if a string is a numeric string. By default, it allows only integers. Floats and exponents can be enabled with
 * options. Optionally allow NaN and Infinity.
 * @param {string} string - String to check
 * @param {object} [options] - Options object
 * @param {boolean} [options.allowFloats=false] - Allow floats
 * @param {boolean} [options.allowExponents=false] - Allow exponents
 * @param {boolean} [options.allowInfinity=false] - Allow Infinity and -Infinity (casing matters)
 * @param {boolean} [options.allowNaN=false] - Allow NaN (casing matters)
 */
const isNumericString = (string: string, options: Options = {}): boolean => { // eslint-disable-line max-statements, max-lines-per-function
    if (typeof string !== "string") {
        throw new TypeError("Expected a string");
    }

    if (options.allowNaN && string === "NaN") {
        return true;
    }

    if (options.allowInfinity && (string === "Infinity" || string === "-Infinity")) {
        return true;
    }

    let normalized = string.toLowerCase();
    if (normalized.startsWith("-")) {
        normalized = normalized.slice(1);
    }

    const parts = normalized.split(".");

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (parts.length > (options.allowFloats ? 2 : 1)) {
        return false;
    }

    const expParts = parts[parts.length - 1]!.split("e");

    if (!options.allowExponents) {
        if (expParts.length > 1) {
            return false;
        }
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (expParts.length > 2) {
            return false;
        }
    }

    const hasPlusAt = normalized.indexOf("+");
    if (hasPlusAt > NOT_FOUND) {
        if (!options.allowExponents) {
            return false;
        }
        if (hasPlusAt !== normalized.lastIndexOf("+")) {
            return false;
        }
        if (hasPlusAt !== normalized.indexOf("e") + 1) {
            return false;
        }
    }

    const hasMinusAt = normalized.indexOf("-");
    if (hasMinusAt > NOT_FOUND) {
        if (!options.allowExponents) {
            return false;
        }
        if (hasMinusAt !== normalized.lastIndexOf("-")) {
            return false;
        }
        if (hasMinusAt !== normalized.indexOf("e") + 1) {
            return false;
        }
    }

    return Boolean(/^[\de.+-]+$/u.exec(normalized));
};

export {
    isNumericString,
};

export type {
    Options as IsNumericStringOptions,
};

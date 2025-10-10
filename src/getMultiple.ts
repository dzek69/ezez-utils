import { get } from "./get.js";

/**
 * Source object to search in.
 *
 * @see {@link getMultiple}.
 */
interface Source { [key: string]: unknown }

const DEFAULT = {};

/**
 * Returns first found value at given list of paths of given object. Will return and stop at undefined if found! If
 * nothing is found then default value (required to pass) will be returned.
 *
 * This is still too dynamic in nature to get full TypeScript support. Properties are not typed, return type is unknown.
 * If your data access is statically known there is no need to use this function, just use `object.property` syntax with
 * optional chaining.
 *
 * @param {Object} source - source object to search in
 * @param {*} defaultValue - default value to return if nothing is found
 * @param {...string|Array.<string>} paths - paths defined as dot-separated properties names or array of properties name
 * @see {@link get} - for base usage example with single path only
 * @example getMultiple(obj, 5, "details.error.message", ["error", "message"], "errorMessage")
 * // will look for obj.details.error.message - if path does not exist
 * // will look for obj.error.message - if not defined
 * // will look for obj.errorMessage - if not defined
 * // will return 5
 * @returns {*} - found value or default value
 */
const getMultiple = (source: Source, defaultValue: unknown, ...paths: (string | string[])[]): unknown => {
    const length = paths.length;
    for (let i = 0; i < length; i++) {
        const properties = paths[i]!;
        const result = get(source, properties, DEFAULT);
        if (result !== DEFAULT) {
            return result;
        }
    }
    return defaultValue;
};

export { getMultiple };

export type {
    Source as GetMultipleSource,
};

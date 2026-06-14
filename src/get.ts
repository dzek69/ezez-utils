/**
 * Source object to search in.
 *
 * @see {@link get}.
 */
interface Source { [key: string]: unknown }

/**
 * Returns the value at given path of given object. If path is not found then default value is returned. No exceptions
 * are thrown when undefined/null value gets in the way.
 *
 * This is still too dynamic in nature to get full TypeScript support. Properties are not typed, return type is unknown.
 * If your data access is statically known there is no need to use this function, just use `object.property` syntax with
 * optional chaining.
 *
 * @param {Object} source - source object to search in
 * @param {string|Array<string>} property - path to the expected value written as dot-separated property names or array
 * with property names. Use Array when your keys includes dots. Keys are treated literally, no parsing is done on keys.
 * @param {*} [defaultValue] - value to return if path is not found. If path is found, but the value is undefined -
 * default value will NOT be used, use `get(...) || default` instead
 * @example get(object, "deep.property") // equals to safe `object.deep.property`
 * @example get(object, ["deep", "property"]) // same as above
 * @example get(object, "deep[0].property")
 * // equals to:
 * object["deep[0]"].property
 * // not:
 * object.deep[0].property
 * @example get(object, "very.deep.property", 5)
 * // if object.very.deep has also `property` property then it value will be returned, even if undefined
 * // else `5` will be returned
 * @returns {*} - found value or default value
 */
const get = (source: Source, property: string | string[], defaultValue?: unknown): unknown => {
    const properties = typeof property === "string" ? property.split(".") : [...property];

    let result: unknown = source;
    while (properties.length) {
        const current = properties.shift()!;
        if (result && typeof result === "object" && current in result) {
            result = (result as Source)[current];
        }
        else {
            return defaultValue;
        }
    }
    return result;
};

export { get };

export type {
    Source as GetSource,
};

/**
 * @see {@link mapValues}
 */
const UNSET = typeof Symbol !== "undefined" ? Symbol("unset") : {};

/**
 * A callback function to {@link mapValues}. It should return new value, optionally may return exported mapValuesUnset
 * value to unset a property in the target the object.
 *
 * @callback MapValuesFn
 * @param {*} value - property value
 * @param {string} key - property name
 * @example function fn(value, key) { return value * 5; } // all properties will be multiplied
 * @example function fn(value, key) {
 *   if (key === "name") {
 *     return mapValuesUNSET;
 *   }
 *   return value.toUpperCase();
 * } // will upper case all properties and filter out name property
 * @returns {*} - new value of a property
 */
type MapValuesFn<S, R> = (value: S[keyof S], key: keyof S) => R;

/**
 * Iterates through object properties returning object with same properties but modified values. Optionally some
 * properties may be filtered out on returned object.
 *
 * @param {Object|Array} source - source object
 * @param {MapValuesFn} fn - map function callback that will return new value of a property
 * @example mapValues({ a: 1, b: 2 }, x => x * 2) // will return { a: 2, b: 4 }
 * @example mapValues({ a: 1, b: 2 }, () => mapValuesUNSET) // will return {}
 * @example mapValues({ a: 1, b: 2 }, (value, key) => key === "b" ? mapValuesUNSET : value * 5) // will return { a: 5 }
 * @returns {Object|Array}
 */
const mapValues = <SourceObject extends Record<string, unknown>, PossibleReturnValues>(
    source: SourceObject, fn: MapValuesFn<SourceObject, PossibleReturnValues>,
): { [P in keyof SourceObject]: PossibleReturnValues } => {
    const keys = Object.keys(source) as Array<keyof SourceObject>;

    // @ts-expect-error TypeScript doesn't work well with this type with reduce
    // @TODO check with ts 5+ or something
    const def: { [P in keyof SourceObject]: PossibleReturnValues } = Array.isArray(source) ? [] : {};

    return keys.reduce((result, key) => {
        const value = fn(source[key], key);
        if (value !== UNSET) {
            result[key] = value; // eslint-disable-line no-param-reassign
        }
        return result;
    }, def);
};

export { mapValues, UNSET as mapValuesUNSET };

export type {
    MapValuesFn,
};

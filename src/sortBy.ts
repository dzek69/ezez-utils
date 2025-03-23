import { sortByMultiple } from "./sortByMultiple.js";

/**
 * Returns a function that can be used as a callback to `.sort()` method. Returned function will sort array by given
 * property.
 *
 * @param propertyName - name of the property to sort by
 * @param asc - should sort be ascending?
 * @param defaultValue - value to use when property is not defined in one of the objects
 */
const sortBy = <T extends Record<string | number | symbol, any>>(propertyName: keyof T, asc = true, defaultValue: unknown = null) => (a: T, b: T) => {
    return sortByMultiple([propertyName], asc, { [propertyName]: defaultValue } as Partial<Record<keyof T, any>>)(a, b);
};

export {
    sortBy,
};

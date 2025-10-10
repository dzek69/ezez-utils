type Obj = Record<string, unknown>;

/**
 * Removes properties from all targets if they are the same as in source. It mutates the targets!
 * Values are JSON-serialized before comparison, therefore, it will consider arrays and objects with the same content
 * as equal.
 *
 * The property must be exactly the same in all targets. If even one target has different value for given property - the
 * property will stay untouched on all targets.
 *
 * If you want to remove properties from each target that has given property the same as source - just run this
 * function in a loop, giving one target at a time.
 *
 * Note: This function is intended to be used on small data sets that are JSON serializable. It will crash on circular
 * references and may produce unexpected results on non-serializable data (like functions).
 *
 * @param source - source object
 * @param target1 - first target object (required)
 * @param ...targetN - more target objects (optional)
 * @example removeCommonProperties({ title: "Hello", author: "John"}, { title: "Hello 2", author: "John" }, { title: "Hello 3", author: "John" });
 * // targets: { title: "Hello 2" }, { title: "Hello 3" }
 * @example removeCommonProperties({ title: "Hello", author: "John"}, { title: "Hello 2", author: "John" }, { title: "Hello 3", author: "Matt" });
 * // targets: { title: "Hello 2", author: "John" }, { title: "Hello 3", author: "Matt" }
 */
const removeCommonProperties = (source: Obj, target1: Obj, ...targetN: Obj[]): void => {
    const targets = [target1, ...targetN];
    const keys = Object.keys(source);
    for (const key of keys) {
        const allTheSame = targets.every((target) => JSON.stringify(target[key]) === JSON.stringify(source[key]));
        if (allTheSame) {
            targets.forEach((target) => {
                // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-dynamic-delete
                delete target[key];
            });
        }
    }
};

export {
    removeCommonProperties,
};

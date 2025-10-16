/**
 * Check if an object has the specified properties with the specified types. Ideal for quick runtime type checking of
 * API responses if you don't need a full schema validation.
 *
 * @example
 * ```typescript
 * const validated = hasProps(obj, { id: "string", age: "number" });
 * if (validated) {
 *     // obj is runtime validated and type is now narrowed down to { id: string; age: number }
 *     console.log(obj.id, obj.age);
 * }
 * ```
 */
const hasProps = <
    T extends Record<string, "string" | "number" | "boolean">,
>(
    obj: unknown,
    schema: T,
): obj is {
    [K in keyof T]:
    T[K] extends "string" ? string
        : T[K] extends "number" ? number
            : T[K] extends "boolean" ? boolean
                : never
} => {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) { return false; }
    for (const [key, type] of Object.entries(schema)) {
        // eslint-disable-next-line valid-typeof
        if (typeof (obj as { [key]: unknown })[key] !== type) { return false; }
    }
    return true;
};

export {
    hasProps,
};

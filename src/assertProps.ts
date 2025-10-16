import { hasProps } from "./hasProps";

type AssertPropsFn = <T extends Record<string, "string" | "number" | "boolean">>(
    obj: unknown,
    schema: T,
) => asserts obj is {
    [K in keyof T]:
    T[K] extends "string" ? string
        : T[K] extends "number" ? number
            : T[K] extends "boolean" ? boolean
                : never
};

/**
 * Asserts that an object has the specified properties with the specified types. Ideal for quick runtime type checking
 * of API responses if you don't need a full schema validation.
 *
 * @example
 * ```typescript
 * const validated = assertProps(obj, { id: "string", age: "number" });
 * // obj is runtime validated and type is now narrowed down to { id: string; age: number }
 * // if the assertion fails, an error is thrown
 * console.log(obj.id, obj.age);
 * ```
 */
const assertProps: AssertPropsFn = <T extends Record<string, "string" | "number" | "boolean">>(
    obj: unknown,
    schema: T,
) => {
    if (!hasProps(obj, schema)) {
        throw new Error("Object does not match the required schema");
    }
};

export {
    assertProps,
};

import type { CamelCasedProperties } from "type-fest";

const camelCaseObject = <T>(obj: T): CamelCasedProperties<T> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            const camelCaseKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            return [camelCaseKey, value];
        }),
    ) as CamelCasedProperties<T>;
};

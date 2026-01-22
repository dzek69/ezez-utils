// eslint-disable-next-line @typescript-eslint/no-unused-vars
type IsTuple<T> = T extends readonly [infer A, ...(infer B)] ? true : false;
type MaybeTupleReturn<T> = IsTuple<T> extends true
    ? (T extends ReadonlyArray<infer U> ? U : never)
    : (T extends Array<infer U> ? U | undefined : never);

/**
 * Picks a random element from an array.
 * @param array - source array
 *
 * @example
 * sample([1, 2, 3]); // 2 (type: number | undefined)
 * sample(["a", "b", "c"]); // "c" (type: string | undefined)
 * sample([]); // undefined (type: undefined)
 *
 * const a = [1, 2, 3] as const;
 * sample(a); // 2 (type: 1 | 2 | 3)
 *
 * sample([1, 1, 1] as [number, number, number]); // 1 (type: number)
 */
const sample = <X, T extends readonly X[]>(array: T): MaybeTupleReturn<T> => {
    return array[Math.floor(Math.random() * array.length)] as MaybeTupleReturn<T>;
};

export {
    sample,
};

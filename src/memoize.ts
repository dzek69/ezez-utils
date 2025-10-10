/**
 * Memoizes a function, caching the result of the last call.
 * If the function is called with the same arguments (and the same context!) again, it will return the cached result.
 *
 * It caches only the last call, so it's not suitable for functions that are called with different arguments in a short
 * time.
 *
 * Warning: Your function must be 100% pure, and it can't access anything dynamic outside its scope.
 *
 * @param fn - function to memoize
 * @returns memoized function
 */
const memoize = <Args extends unknown[], Ret>(fn: (...args: Args) => Ret): (this: unknown, ...args: Args) => Ret => {
    let lastArgs: Args | undefined, lastResult: Ret, lastThis: unknown;

    return function memoized(this: unknown, ...args: Args): Ret {
        if (
            lastThis === this
            && lastArgs?.length === args.length
            && args.every((arg, i) => Object.is(arg, lastArgs![i]))
        ) {
            return lastResult;
        }

        lastThis = this;
        lastArgs = args;
        lastResult = fn.apply(this, args);

        return lastResult;
    };
};

export {
    memoize,
};

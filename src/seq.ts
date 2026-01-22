const fail = function() {
    return Promise.reject(new TypeError("At least one function must be provided."));
};

/**
 * Function to be called.
 *
 * @see {@link seq}
 */
type Fn<T> = () => T;

/**
 * Functions to call sequentially.
 * Either an array of functions or a list of functions.
 *
 * @see {@link seq}
 */
type Functions<T> = Array<Fn<T>> | [Array<Fn<T>>];

/**
 * A function that decides if the sequential run should be early stopped.
 *
 * @param {*} e - Value thrown by the function (usually Error).
 * @see {@link seq}
 */
type EarlyBreaker = (e: unknown) => boolean;

const run = <T>(list: Array<Fn<T>>, earlyBreaker?: EarlyBreaker): Promise<T> => {
    if (!list.length) {
        return fail();
    }

    const promises = [...list];

    return new Promise((resolve, reject) => {
        let promise: Promise<T | undefined> = Promise.resolve(undefined);

        const errors: Error[] = [];

        const doTry = function(error?: Error) {
            if (error !== undefined && earlyBreaker?.(error)) {
                reject(error);
                return;
            }

            if (error) {
                errors.push(error);
            }
            const fn = promises.shift();
            if (typeof fn !== "function") {
                const finalError = new Error("Every function had thrown.", {
                    cause: {
                        errors,
                    },
                });
                // @ts-expect-error More details on error object are wanted
                finalError.details = { errors };
                reject(finalError);
            }
            promise = (promise.then(fn).then(resolve, doTry)) as unknown as Promise<T>;
        };

        doTry();
    });
};

/**
 * The same as {@link seq} but accepts a function that gets run after each error and using that erro decides if continue
 * to try next functions.
 *
 * @example seqEarlyBreak(
 *   (e) => e.message === "important error",
 *   () => { throw new Error("important error") }, () => 2, () => 3
 * ) // throws given important error, does not run next functions
 * @param {EarlyBreaker} earlyBreaker - function that decides about early breaking the sequential run
 * @param {...Functions<*>[]} args - functions to run, you can either pass them as many arguments or just single
 * arguments with array
 * @returns {*} - whatever gets returned from given functions
 */
const seqEarlyBreak = <T>(earlyBreaker: EarlyBreaker | undefined, ...args: Functions<T>): Promise<T> => {
    if (args.length === 1) {
        return run(Array.isArray(args[0]) ? args[0] : [args[0]], earlyBreaker);
    }
    return run(args as Array<Fn<T>>, earlyBreaker);
};

/**
 * Runs given functions sequentially one by one, until any returns value. Supports async functions. Throws with new
 * Error when every function throws.
 *
 * @example seq(() => 1, () => 2, () => 3) // returns 1
 * @example seq(() => { throw new Error("1") }, () => 2, () => 3) // returns 2
 * @example seq(() => { throw new Error("1") }, () => { throw new Error("2") } }) // throws
 * @param {...Functions<*>[]} fns - functions to run, you can either pass them as many arguments or just single
 * arguments with array
 * @returns {*} - whatever gets returned from given functions
 */
const seq = <T>(...fns: Functions<T>): Promise<T> => {
    return seqEarlyBreak(undefined, ...fns);
};

export { seq, seqEarlyBreak };

export type {
    EarlyBreaker as SeqEarlyBreaker,
    Functions as SeqFunctions,
    Fn as SeqFn,
};

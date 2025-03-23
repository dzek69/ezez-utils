/**
 * This function helps you timeout your promises while keeping the TS types right.
 *
 * @example await race(yourPromise, 1000); // resolves (or rejects) with the value of yourPromise or rejects with "Race: Timeout" message in a second
 * @example
 * ```
 * type Data = { a: number };
 * const myPromise = new Promise<Data>((resolve) => setTimeout(() => resolve({ a: 1 }), 2000));
 * const { a } = await race(myPromise, 1000); // You're allowed to destructure the result with TS
 * ```
 *
 * @param promise - Your promise
 * @param timeout - Time in milliseconds to wait for the promise to resolve
 * @param message - Error message to use when the timeout is reached
 */
const race = <T>(promise: Promise<T>, timeout: number, message = "Race: Timeout"): Promise<T> => {
    return Promise.race([
        promise, new Promise<T>((_, reject) => {
            setTimeout(() => {
                reject(new Error(message));
            }, timeout);
        }),
    ]);
};

export {
    race,
};

// TODO unit tests

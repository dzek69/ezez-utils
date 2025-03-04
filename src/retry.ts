import { wait } from "./wait";

type EarlyBreaker = (error: unknown, count: number) => boolean;
type Options = {
    /**
     * Maximum number of retries. If not specified, the function will retry indefinitely.
     * 0 means the function will be executed once (no retries)
     * 1 means the function will be executed twice (1 retry), etc.
     */
    maxRetries?: number;
    /**
     * Function to determine if the function should be retried, based on the error that was thrown and the number of retries so far.
     */
    earlyBreak?: EarlyBreaker;
    /**
     * Number of milliseconds to wait between retries.
     */
    waitBetween?: number | ((retriesCount: number) => number);
};

/**
 * Execute a function until it succeeds. Limit the retries, wait between retries, control when to stop trying early.
 * @param fn - The function to execute.
 * @param options - Options controlling the behavior of the function.
 */
const retry = async <T>(fn: () => Promise<T>, options?: Options): Promise<T> => {
    const maxRetries = options?.maxRetries ?? Infinity;
    const earlyBreak = options?.earlyBreak ?? (() => false);
    const waitBetween = options?.waitBetween ?? 0;

    let retriesCount = 0;

    while (true) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
        try {
            return await fn();
        }
        catch (e: unknown) {
            if (retriesCount >= maxRetries || earlyBreak(e, retriesCount)) {
                throw e; // eslint-disable-line @typescript-eslint/only-throw-error
            }
            retriesCount++;
            if (waitBetween) {
                await wait(typeof waitBetween === "function" ? waitBetween(retriesCount) : waitBetween);
            }
        }
    }
};

export {
    retry,
};

// TODO unit tests

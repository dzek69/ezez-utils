import { noop } from "./noop.js";

const DEFAULT_INTERVAL = 50;

type TTimeout = ReturnType<typeof setTimeout>;
type MaybePromise<T> = T | Promise<T>;

type Options = {
    /**
     * Interval between checks in milliseconds
     */
    interval?: number;
    /**
     * Timeout in milliseconds
     */
    timeout?: number;
    /**
     * Maximum number of tries, 1 means no retry!
     */
    maxTries?: number;
};

const defaultOptions: Required<Options> = {
    interval: DEFAULT_INTERVAL,
    timeout: Infinity,
    maxTries: Infinity,
};

/**
 * Appends the synchronously-captured caller frames onto an error created later (on a timer or
 * microtask), so its stack trace points at whoever called `waitFor` instead of just node internals.
 */
const graftCallerStack = (error: Error, callSite: Error): void => {
    const callerFrames = callSite.stack?.replace(/^.*\n/u, "");
    if (callerFrames) {
        // eslint-disable-next-line no-param-reassign
        error.stack = error.stack ? `${error.stack}\n${callerFrames}` : callerFrames;
    }
};

/**
 * Runs the callback function every specified interval and returns a Promise that resolves when the callback returns
 * any other value than `null`, `undefined` or `false`.
 * If your callback throws (or Promise rejects) it will stop the interval and reject the returned Promise.
 * To avoid that use:
 * ```typescript
 * waitFor(() => promiseReturningFunction().catch(() => null));
 * // or
 * waitFor(() => safe(() => functionThatThrows()));
 * ```
 * @param fn - callback function
 * @param options - options object
 */
const waitFor = <T>(fn: () => MaybePromise<T>, options: Options = defaultOptions): Promise<T> => { // eslint-disable-line max-lines-per-function
    // Captured synchronously on the caller's stack: once execution hops onto a timer or
    // microtask those frames are gone, so we graft them back onto any rejected error (see
    // `graftCallerStack`) to keep production stack traces pointing at the actual caller.
    const callSite = new Error();

    return new Promise<T>((resolve, reject) => {
        let intervalTimer: TTimeout, failTimer: TTimeout;

        const fail = (error: Error): void => {
            graftCallerStack(error, callSite);
            clearTimeout(failTimer);
            clearTimeout(intervalTimer);
            reject(error);
        };

        const opts = { ...defaultOptions, ...options };
        if (typeof opts.maxTries === "number" && opts.maxTries < 1) {
            fail(new TypeError("[waitFor] maxTries must be greater than 0"));
            return;
        }

        if (Number.isFinite(opts.timeout)) {
            failTimer = setTimeout(() => {
                fail(new Error("[waitFor] Timeout"));
            }, opts.timeout);
        }

        let tries = 0;
        const tryFn = (async () => {
            try {
                tries++;
                const result = await fn();
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (result != null && result !== false) {
                    clearTimeout(failTimer);
                    clearTimeout(intervalTimer);
                    resolve(result);
                }
                else {
                    if (Number.isFinite(opts.maxTries) && tries >= opts.maxTries) {
                        fail(new Error("[waitFor] Max tries reached"));
                        return;
                    }

                    intervalTimer = setTimeout(() => {
                        tryFn().catch(noop);
                    }, opts.interval);
                }
            }
            catch (error: unknown) {
                const e: Error & { details?: unknown } = new Error(
                    "[waitFor] check function threw an error", { cause: error },
                );
                e.details = { error };
                fail(e);
            }
        });
        tryFn().catch(noop);
    });
};

export { waitFor };

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
const waitFor = <T>(fn: () => MaybePromise<T>, options: Options = defaultOptions): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        let intervalTimer: TTimeout, failTimer: TTimeout;

        const opts = { ...defaultOptions, ...options };
        if (typeof opts.maxTries === "number" && opts.maxTries < 1) {
            reject(new TypeError("[waitFor] maxTries must be greater than 0"));
            return;
        }

        if (Number.isFinite(opts.timeout)) {
            failTimer = setTimeout(() => {
                reject(new Error("[waitFor] Timeout"));
                clearTimeout(intervalTimer);
            }, opts.timeout);
        }

        let tries = 0;

        // eslint-disable-next-line max-statements
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
                        clearTimeout(failTimer);
                        clearTimeout(intervalTimer);
                        reject(new Error("[waitFor] Max tries reached"));
                        return;
                    }

                    intervalTimer = setTimeout(() => {
                        tryFn().catch(noop);
                    }, options.interval);
                }
            }
            catch (error: unknown) {
                clearTimeout(failTimer);
                clearTimeout(intervalTimer);

                const e: Error & { details?: unknown } = new Error("[waitFor] check function threw an error");
                e.details = { error };
                reject(e);
            }
        });
        tryFn().catch(noop);
    });
};

export { waitFor };

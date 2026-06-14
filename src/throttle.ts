interface Opts {
    /**
     * Should function be invoked immediately on first call to throttled function
     */
    leading?: boolean;
    /**
     * Should function be called after given time
     */
    trailing?: boolean;
}

interface Extras<R = unknown> {
    /**
     * Stops any planned calls (and resets the `time` array progress)
     */
    cancel: () => void;
    /**
     * Immediately runs planned call, returning its result (or the last cached result if nothing is planned).
     */
    flush: () => R | undefined;
}

const defaultOptions: Required<Opts> = {
    leading: true,
    trailing: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CanReturnUndefined<F extends (...args: any[]) => any> = (...args: Parameters<F>) => ReturnType<F> | undefined;

/**
 * Creates a throttled function that calls given function only once every given time. Throttled function takes the same
 * arguments, returns "cached" value of last "real" call to the given function.
 * Time (in ms) can be specified as an array - each "real" call to the function will then pick next value of that array
 * as a time to wait for the next "real" call. This is useful for throttled notifications or auto-retries. Last value of
 * the array will be used if no more values.
 * Returned function also includes `cancel` property - call it to stop any planned calls (and reset the `time` array
 * progress) and `flush` property - call it to immediately run planned call.
 *
 * You can provide options to specify if function should be invoked immediately on first call to throttled function
 * (`leading` property) and if it should be called after given time (`trailing` property).
 *
 * If (this is default) both `leading` and `trailing` property are true then it's required to call throttled function at
 * least twice.
 * @param {function} fn - function to throttle
 * @param {number | number[]} time - throttle time as number or array of numbers (min 1 element)
 * @param {Opts} options
 */
const throttle = <RT, F extends (...args: any[]) => RT>( // eslint-disable-line max-lines-per-function, @typescript-eslint/no-explicit-any
    fn: F, time: number | [number, ...number[]] = 0, options?: Opts,
): CanReturnUndefined<F> & Extras<RT> => {
    const opts: Required<Opts> = {
        leading: options?.leading ?? defaultOptions.leading,
        trailing: options?.trailing ?? defaultOptions.trailing,
    };

    if (!opts.trailing && !opts.leading) {
        throw new TypeError("Throttle with trailing & leading options `false` won't do anything.");
    }
    if (typeof time !== "number" && !time.length) {
        throw new TypeError("`time` must be an array with at least one number.");
    }

    const finalTime = typeof time === "number" ? time : time[time.length - 1]!;

    let lastRun = 0,
        timeoutId: ReturnType<typeof setTimeout> | null = null,
        lastResult: RT | undefined,
        lastArgs: Parameters<F>,
        lastTime = typeof time === "number" ? time : time[0],
        leadingCalled = false;

    const times = typeof time === "number" ? [time] : [...time];

    // eslint-disable-next-line max-statements
    const throttledFn = ((...args: Parameters<F>) => {
        lastArgs = args;
        if (timeoutId !== null) { // if timer goes on, then we shouldn't do anything
            return lastResult;
        }

        if (!opts.trailing) { // we don't want a timer
            if (Date.now() - lastRun < lastTime) { // it's not yet the time to call the func
                return lastResult;
            }
            lastTime = times.shift() ?? finalTime;
            lastRun = Date.now();
            lastResult = fn(...args);
            return lastResult;
        }

        // we want timers here!
        const diffLastRun = Date.now() - lastRun;
        if (opts.leading && (!leadingCalled || typeof time === "number") && diffLastRun >= (times[0] ?? finalTime)) {
            // we want initial run and last run was long time ago
            lastRun = Date.now();
            lastResult = fn(...args);
            leadingCalled = true;
            return lastResult;
        }

        if (lastRun || !opts.leading) {
            lastTime = times.shift() ?? finalTime;
        }
        timeoutId = setTimeout(() => {
            timeoutId = null;
            lastRun = Date.now();
            lastResult = fn(...args);
        }, lastRun ? (lastTime - diffLastRun + 1) : lastTime);

        return lastResult;
    }) as (CanReturnUndefined<F> & Extras<RT>);

    throttledFn.cancel = () => {
        timeoutId !== null && clearTimeout(timeoutId);
        timeoutId = null;
        lastRun = 0;
        lastResult = undefined;

        // we can't replace `times` with different instance - throttledFn already has one, so we clear the array
        // and refill it
        times.length = 0;
        if (typeof time === "number") {
            times.push(time);
        }
        else {
            times.push(...time);
        }
        lastTime = typeof time === "number" ? time : time[0];
    };
    throttledFn.flush = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
            lastRun = Date.now();
            lastResult = fn(...lastArgs);
        }
        return lastResult;
    };

    return throttledFn;
};

export {
    throttle,
};

export type {
    Extras as ThrottledFunctionExtras,
    Opts as ThrottleOptions,
    CanReturnUndefined as ThrottledFunction,
};

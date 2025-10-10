/**
 * A function that executes a callback and ignores it completely, if it throws an error, returns any value, rejects
 * a promise - it will be all ignored. It will attach a catch handler to any returned promise to avoid unhandled
 * rejections.
 *
 * Use it whenever you want to call a function, but you are not interested in its result or failure.
 *
 * @example
 * ```javascript
 * import { trackPageVisit } from "analytics-service";
 *
 * function onButtonClick() {
 *     ignore(() => trackPageVisit("button-click"));
 *     // ^ prevent uncaught errors or unhandled promise rejections from trackPageVisit
 * }
 * Promise.resolve(5).then(ignore(trackPageVisit)).then((value) => {
 *   console.log(value); // 5, won't ever crash due to errors in trackPageVisit
 * });
 * ```
 * @param callback
 */
const ignore = (callback: () => unknown): undefined => {
    try {
        // eslint-disable-next-line callback-return
        const p = callback();
        if (p && typeof p === "object"
            && "then" in p && typeof p.then === "function"
            && "catch" in p && typeof p.catch === "function") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            p.catch(() => null);
        }
    }
    catch {}
};

export {
    ignore,
};

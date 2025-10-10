import { wait } from "./wait.js";

const DEFAULT_MAX_BLOCK_TIME = 16; // a frame
const DEFAULT_WAIT_TIME = 1;

/**
 * Non-blocking version of `Array.prototype.map`, it will pause the map loop every `pauseEvery`. Keep in mind that
 * depending on your code workload the pause interval and duration may be exact or longer than specified. It's the same
 * single thread JavaScript nature setTimeout have to follow.
 * @param context - original array
 * @param callback - map function
 * @param pauseEvery - pause after this many ms
 * @param pauseTime - how long to wait on pause
 */
const mapAsync = async <T, Y>(
    context: readonly T[],
    callback: (item: T, key: number, array: readonly T[]) => Y,
    pauseEvery = DEFAULT_MAX_BLOCK_TIME,
    pauseTime = DEFAULT_WAIT_TIME,
): Promise<Y[]> => {
    let lastWaitMoment = Date.now();
    const result = [];

    const l = context.length;

    for (let i = 0; i < l; i++) {
        const item = context[i]!;
        // eslint-disable-next-line callback-return
        result.push(callback(item, i, context));
        if (Date.now() - lastWaitMoment >= pauseEvery) {
            await wait(pauseTime);
            lastWaitMoment = Date.now();
        }
    }

    return result;
};

export {
    mapAsync,
};

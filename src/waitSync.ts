/**
 * Synchronously wait for a given time, blocking the event loop [!]
 * @param {number} timeMs - time to wait
 * @returns {Promise<void>}
 */
const waitSync = (timeMs = 0): void => {
    const s = Date.now();
    // eslint-disable-next-line no-empty
    while (Date.now() - s < timeMs) {}
};

export {
    waitSync,
};

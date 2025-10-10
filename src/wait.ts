/**
 * Returns a promise that resolves after given time
 * @param {number} timeMs - time to wait
 * @returns {Promise<void>}
 */
const wait = (timeMs = 0): Promise<void> => {
    return new Promise<void>((resolve) => {
        setTimeout(() => { resolve(); }, timeMs);
    });
};

export {
    wait,
};

/**
 * Always returns `true`. Useful as a ready-to-use callback.
 *
 * @see {@link f}
 *
 * @example
 * const fileExists = await fs.promises.access(path).then(t, f);
 * @returns true
 */
const t = (): true => true;

export {
    t,
};

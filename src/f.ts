/**
 * Always returns `false`. Useful as a ready-to-use callback.
 *
 * @see {@link t}
 *
 * @example
 * const fileExists = await fs.promises.access(path).then(t, f);
 * @returns false
 */
const f = (): false => false;

export {
    f,
};

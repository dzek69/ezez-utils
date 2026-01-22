// eslint-disable-next-line @typescript-eslint/no-shadow
import must from "must";

// @ts-expect-error Complaining about root dir
import createSpy from "../test/createSpy";
import { memoize } from "./memoize";

describe("memoize", () => {
    it("should memoize the result if called with the same arguments", async () => {
        const sum = createSpy((a: number, b: number) => a + b);
        const memoizedSum = memoize(sum);

        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
        must(memoizedSum(1, 2)).equal(3);
        must(memoizedSum(1, 2)).equal(3);
        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
    });

    it("should trigger the function again if arguments are changed", async () => {
        const sum = createSpy((a: number, b: number) => a + b);
        const memoizedSum = memoize(sum);

        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
        must(memoizedSum(1, 3)).equal(4);
        must(sum.__spy.calls.length).equal(2);
    });

    it("should remember only one value", () => {
        const sum = createSpy((a: number, b: number) => a + b);
        const memoizedSum = memoize(sum);

        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
        must(memoizedSum(1, 3)).equal(4);
        must(sum.__spy.calls.length).equal(2);
        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(3);
    });

    it("should recalc if arguments amount changes", async () => {
        const sum = createSpy((a: number, b: number) => a + b);
        const memoizedSum = memoize(sum);

        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(1);
        must(memoizedSum(1, 2, 0)).equal(3);
        must(sum.__spy.calls.length).equal(2);
        must(memoizedSum(1, 2)).equal(3);
        must(sum.__spy.calls.length).equal(3);
    });

    it("works with common pitfall values", async () => {
        const sum = createSpy((a: number, b: number) => a + b);
        const memoizedSum = memoize(sum);

        memoizedSum(1, NaN);
        must(sum.__spy.calls.length).equal(1);
        memoizedSum(1, NaN);
        must(sum.__spy.calls.length).equal(1);

        memoizedSum(1, 0);
        must(sum.__spy.calls.length).equal(2);
        memoizedSum(1, -0);
        must(sum.__spy.calls.length).equal(3);
    });

    it("compares by reference", async () => {
        const fn = createSpy((a: unknown) => null);
        const memoizedFn = memoize(fn);

        const arr: never[] = [];

        memoizedFn([]);
        must(fn.__spy.calls.length).equal(1);
        memoizedFn([]);
        must(fn.__spy.calls.length).equal(2);

        memoizedFn(arr);
        must(fn.__spy.calls.length).equal(3);
        memoizedFn(arr);
        must(fn.__spy.calls.length).equal(3);
    });
});

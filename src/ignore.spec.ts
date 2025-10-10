// eslint-disable-next-line @typescript-eslint/no-shadow
import must from "must";

// @ts-ignore
import createSpy from "../test/createSpy";
import { ignore } from "./ignore";
import { wait } from "./wait";

const syncCrashingFunction = createSpy(() => {
    throw new Error("Sync function crashed");
});

const promiseTypedSyncCrashingFunction = createSpy((): Promise<void> => {
    throw new Error("Promise typed sync function crashed");
});

const asyncCrashingFunction = createSpy(async () => {
    throw new Error("Async function crashed");
});

const asyncCrashingFunctionSlow = createSpy(async () => {
    await wait(500);
    throw new Error("Async function crashed");
});

const get5 = createSpy(() => 5);

describe("ignore", () => {
    beforeEach(() => {
        syncCrashingFunction.__spy.reset();
        promiseTypedSyncCrashingFunction.__spy.reset();
        asyncCrashingFunction.__spy.reset();
        asyncCrashingFunctionSlow.__spy.reset();
        get5.__spy.reset();
    });

    it("it should not crash on sync function crash", async () => {
        ignore(syncCrashingFunction);
        ignore(promiseTypedSyncCrashingFunction);
        // ^ technically this is also a sync crash
    });

    it("it should not crash on async function crash", async () => {
        ignore(asyncCrashingFunction);
    });

    it("it should not wait for async function", async () => {
        const now = Date.now();
        ignore(asyncCrashingFunctionSlow);
        const after = Date.now();
        if (after - now > 100) {
            throw new Error("Took too long, it waited for the async function");
        }
    });

    it("should not return a value", async () => {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const res = ignore(get5);
        must(res).be.undefined();
    });

    it("actually calls the function", async () => {
        must(syncCrashingFunction.__spy.calls.length).be.equal(0);
        must(promiseTypedSyncCrashingFunction.__spy.calls.length).be.equal(0);
        must(asyncCrashingFunction.__spy.calls.length).be.equal(0);
        must(get5.__spy.calls.length).be.equal(0);

        ignore(syncCrashingFunction);
        must(syncCrashingFunction.__spy.calls.length).be.equal(1);

        ignore(promiseTypedSyncCrashingFunction);
        must(promiseTypedSyncCrashingFunction.__spy.calls.length).be.equal(1);

        ignore(asyncCrashingFunction);
        must(asyncCrashingFunction.__spy.calls.length).be.equal(1);

        ignore(get5);
        must(get5.__spy.calls.length).be.equal(1);
    });
});

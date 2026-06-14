import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { race } from "./race";
import { wait } from "./wait";

describe("race", () => {
    it("resolves with the promise value when it settles before the timeout", async () => {
        const start = Date.now();
        const result = await race(Promise.resolve(42), 100);
        must(result).equal(42);
        must(Date.now() - start).be.below(90);
    });

    it("rejects with the promise error when it rejects before the timeout", async () => {
        const start = Date.now();
        await race(Promise.reject(new Error("boom")), 100).then(() => {
            throw new Error("Should not resolve");
        }, (e: unknown) => {
            must((e as Error).message).equal("boom");
            must(Date.now() - start).be.below(90);
        });
    });

    it("rejects with a timeout error when the promise is too slow", async () => {
        const slow = wait(200).then(() => "late");
        await race(slow, 50).then(() => {
            throw new Error("Should not resolve");
        }, (e: unknown) => {
            must(e).instanceOf(Error);
            must((e as Error).message).equal("Race: Timeout");
        });
    });

    it("uses a custom timeout message", async () => {
        const slow = wait(200).then(() => "late");
        await race(slow, 50, "too slow").then(() => {
            throw new Error("Should not resolve");
        }, (e: unknown) => {
            must((e as Error).message).equal("too slow");
        });
    });
});

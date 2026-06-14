import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { retry } from "./retry";

describe("retry", () => {
    it("returns the result on first success without retrying", async () => {
        let calls = 0;
        const result = await retry(async () => {
            calls++;
            return "ok";
        });
        must(result).equal("ok");
        must(calls).equal(1);
    });

    it("retries until the function succeeds", async () => {
        let calls = 0;
        const result = await retry(async () => {
            calls++;
            if (calls < 3) {
                throw new Error("fail");
            }
            return calls;
        });
        must(result).equal(3);
        must(calls).equal(3);
    });

    it("with maxRetries 0 runs once and rethrows the error", async () => {
        let calls = 0;
        await retry(async () => {
            calls++;
            throw new Error("nope");
        }, { maxRetries: 0 }).then(() => {
            throw new Error("Should not resolve");
        }, (e: unknown) => {
            must((e as Error).message).equal("nope");
        });
        must(calls).equal(1);
    });

    it("with maxRetries N runs N+1 times before giving up", async () => {
        let calls = 0;
        await retry(async () => {
            calls++;
            throw new Error("nope");
        }, { maxRetries: 2 }).catch(() => { /* expected to reject */ });
        must(calls).equal(3);
    });

    it("stops early when earlyBreak returns true", async () => {
        let calls = 0;
        const seenCounts: number[] = [];
        await retry(async () => {
            calls++;
            throw new Error("stop");
        }, {
            maxRetries: 10,
            earlyBreak: (_e, count) => {
                seenCounts.push(count);
                return calls === 2;
            },
        }).catch(() => { /* expected to reject */ });
        must(calls).equal(2);
        must(seenCounts).eql([0, 1]);
    });

    it("waits between retries, passing the retry count to the wait function", async () => {
        let calls = 0;
        const waitCounts: number[] = [];
        const result = await retry(async () => {
            calls++;
            if (calls < 3) {
                throw new Error("fail");
            }
            return "done";
        }, {
            waitBetween: (count) => {
                waitCounts.push(count);
                return 10;
            },
        });
        must(result).equal("done");
        must(calls).equal(3);
        must(waitCounts).eql([1, 2]);
    });
});

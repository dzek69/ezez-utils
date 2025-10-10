// eslint-disable-next-line @typescript-eslint/no-shadow
import must from "must";

// @ts-ignore
import createSpy from "../test/createSpy";
import { wait } from "./wait";
import { waitFor } from "./waitFor";

describe("waitFor", () => {
    it("calls function multiple times until it returns truthy value", async () => {
        let calls = 0;
        const spy = createSpy(() => {
            calls++;
            return calls === 3;
        });

        const start = Date.now();
        await waitFor(spy);

        must(calls).equal(3);
        // waited for 3 tries, should be 100ms (0 for first try) in total
        must(Date.now() - start).be.gte(100);
    });

    it("returns value if check passes", async () => {
        const x = await waitFor(() => 5);
        must(x).equal(5);
    });

    it("returns value if check passes in non-first try", async () => {
        let calls = 0;
        const spy = createSpy(() => {
            calls++;
            return calls === 3;
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const res = await waitFor(spy);
        must(res).equal(true);
    });

    it("allows to adjust interval", async () => {
        let calls = 0;
        const spy = createSpy(() => {
            calls++;
            return calls === 3;
        });

        const start = Date.now();
        await waitFor(spy, { interval: 150 });

        must(calls).equal(3);
        must(Date.now() - start).be.gte(300);
    });

    it("time outs after given time", async () => {
        const spy = createSpy(() => false);
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await must(waitFor(spy, {
            interval: 40,
            timeout: 300,
        })).reject.to.instanceOf(Error);
        const calls = spy.__spy.calls.length;
        await wait(100);
        must(spy.__spy.calls.length).equal(calls);
    });

    it("time outs after given count of retries", async () => {
        const spy = createSpy(() => false);

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await must(waitFor(spy, {
            interval: 40,
            maxTries: 3,
        })).reject.to.instanceOf(Error);

        must(spy.__spy.calls).have.length(3);
    });

    it("validates max tries", async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await must(waitFor(() => null, {
            maxTries: 0,
        })).reject.to.instanceOf(TypeError);

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await must(waitFor(() => null, {
            maxTries: -666,
        })).reject.to.instanceOf(TypeError);
    });

    it("crashes if check function crashes", async () => {
        await waitFor(() => {
            // @ts-ignore
            throw new Error(5);
        }, { interval: 40 }).then(() => {
            throw new Error("Should not resolve");
        }, (e: unknown) => {
            must(e).instanceOf(Error);
            must((e as Error).message).equal("[waitFor] check function threw an error");
        });
    });

    describe("treats most falsy values as succeeded check", () => {
        it("numeric zero", async () => {
            const result = await waitFor(() => 0);
            must(result).equal(0);
        });

        it("empty string", async () => {
            const result = await waitFor(() => "");
            must(result).equal("");
        });
    });

    describe("supports promises", () => {
        it("truthy value", async () => {
            const result = await waitFor(() => true);
            must(result).be.true();
        });

        it("by retrying if Promise returns false", async () => {
            let calls = 0;
            const spy = createSpy(() => {
                calls++;
                return calls === 3;
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = await waitFor(spy);
            must(result).be.true();
            must(calls).equal(3);
        });

        it("by crashing if check function returns rejected promise", async () => {
            await waitFor(() => {
                return Promise.reject(new Error("oops"));
            }, { interval: 40 }).then(() => {
                throw new Error("Should not resolve");
            }, (e: unknown) => {
                must(e).instanceOf(Error);
                must((e as Error).message).equal("[waitFor] check function threw an error");
            });
        });
    });
});


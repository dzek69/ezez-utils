import { later } from "./later.js";

describe("later", () => {
    it("creates values synchronously", async () => {
        const l = later();
        l.must.have.property("promise");
        l.must.have.property("resolve");
        l.must.have.property("reject");
    });

    it("creates expected types", async () => {
        const l = later();

        l.promise.must.be.instanceof(Promise);
        l.resolve.must.be.a.function();
        l.reject.must.be.a.function();
    });

    it("resolves promise", async () => {
        const l = later();
        l.resolve(42);

        const r = await l.promise;
        r.must.equal(42);
    });

    it("rejects promise", async () => {
        const l = later();
        l.reject(new Error("foo"));

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await l.promise.must.reject.with.error("foo");
    });
});

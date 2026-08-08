import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { f } from "./f";

describe("f", () => {
    it("always returns false", () => {
        must(f()).equal(false);
        // @ts-expect-error testing that arguments are ignored
        must(f(true, 1, "yep")).equal(false);
    });

    it("works as a promise callback", async () => {
        must(await Promise.reject(new Error("nope")).then(t => t, f)).equal(false);
    });
});

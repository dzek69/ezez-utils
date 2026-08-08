import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { t } from "./t";

describe("t", () => {
    it("always returns true", () => {
        must(t()).equal(true);
        // @ts-expect-error testing that arguments are ignored
        must(t(false, 0, "nope")).equal(true);
    });

    it("works as a promise callback", async () => {
        must(await Promise.resolve("anything").then(t)).equal(true);
    });
});

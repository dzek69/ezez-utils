import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { scale } from "./scale";

describe("scale", () => {
    it("maps a value from one range to another", async () => {
        must(scale(0, 10, 0, 100, 5)).equal(50);
        must(scale(10, 20, 0, 200, 15)).equal(100);
    });

    it("handles inverted target ranges", async () => {
        must(scale(0, 10, 100, 0, 5)).equal(50);
    });

    it("throws when fromMin equals fromMax", async () => {
        must(() => scale(5, 5, 0, 100, 5)).throw(/fromMin and fromMax must not be equal/u);
    });
});

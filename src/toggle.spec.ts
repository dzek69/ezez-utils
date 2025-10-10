import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { toggle } from "./toggle.js";

describe("toggle", () => {
    it("adds the value if it doesn't exist", async () => {
        must(toggle([1], 2)).eql([1, 2]);
    });

    it("removes the value if it exists", async () => {
        must(toggle([1, 2], 2)).eql([1]);
    });

    it("removes only one occurrence", async () => {
        must(toggle([1, 2, 2], 2)).eql([1, 2]);
    });

    it("modifies the original array when adding", async () => {
        const array = [1];
        toggle(array, 2);
        must(array).eql([1, 2]);
    });

    it("modifies the original array when removing", async () => {
        const array = [1, 2];
        toggle(array, 2);
        must(array).eql([1]);
    });

    it("returns the original array", async () => {
        const array = [1];
        // adding
        must(toggle(array, 2)).equal(array);
        // removing
        must(toggle(array, 2)).equal(array);
    });

    it("adds NaN values correctly", async () => {
        must(toggle([1], NaN)).eql([1, NaN]);
    });

    it("removes NaN values correctly", async () => {
        must(toggle([1, NaN], NaN)).eql([1]);
    });
});

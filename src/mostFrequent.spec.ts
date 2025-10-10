import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { mostFrequent } from "./mostFrequent.js";

describe("mostFrequent", () => {
    it("returns most frequent element", () => {
        mostFrequent([1, 2, 3, 2, 5, 400]).must.equal(2);
    });

    it("returns first most frequent element if equal top count", () => {
        mostFrequent([1, 2, 3, 2, 5, 400, 400]).must.equal(2);
    });

    it("returns first value if nothing wins", () => {
        mostFrequent([5, 9, 1000]).must.equal(5);
    });

    it("returns undefined if array empty", () => {
        must(mostFrequent([])).equal(undefined);
    });

    it("compares strictly", () => {
        mostFrequent([1, "1", 1, "1", 2, 2, 2]).must.equal(2);
    });

    it("works with NaNs", () => {
        // lol, must.js doesn't work with NaNs
        Number.isNaN(mostFrequent([5, NaN, 300, NaN])).must.be.true();
    });

    it("compares by reference", function() {
        const a = {};
        const b = {};

        mostFrequent([a, b, b]).must.equal(b);
    });
});

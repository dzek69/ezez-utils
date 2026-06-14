// eslint-disable-next-line @typescript-eslint/no-shadow
import must from "must";

import { samples } from "./samples";

describe("samples", () => {
    it("must pick random elements", async () => {
        const elements = [1, 2, 3];

        const result = samples(elements, 2);
        must(result).have.length(2);

        for (const item of result) {
            must(elements).include(item);
        }
        must([...new Set(result)]).have.length(2);
    });

    it("should be able to pick one element", async () => {
        const elements = [1, 2, 3];
        const result = samples(elements, 1);
        must(result).have.length(1);
        must(elements).include(result[0]);
    });

    it("should return empty array if no elements to pick", async () => {
        const elements = [1, 2, 3];
        const result = samples(elements, 0);
        must(result).be.empty();
    });

    it("should return all elements if elements to pick is greater than array length", async () => {
        const elements = [1, 2, 3];
        const result = samples(elements, 5);
        must(result).have.length(3);
        must(result).eql(elements);
    });

    it("should return all elements if elements to pick is equal to array length", async () => {
        const elements = [1, 2, 3];
        const result = samples(elements, 3);
        must(result).have.length(3);
        must(result).eql(elements);
    });

    it("should throw if elements to pick is negative", async () => {
        const elements = [1, 2, 3];
        must(() => samples(elements, -1)).throw();
    });

    it("should not pad with undefined when allowShuffle and elementsToPick exceed length", async () => {
        const elements = [1, 2, 3];
        // BUG: with allowShuffle the early-return is skipped and the loop runs `elementsToPick`
        // times; once the keys are exhausted it pushes `array[NaN]` (undefined) as padding.
        const result = samples(elements, 5, true);
        must(result).have.length(3);
        must(result).not.include(undefined);
    });
});

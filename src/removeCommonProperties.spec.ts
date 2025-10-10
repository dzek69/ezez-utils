import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { removeCommonProperties } from "./removeCommonProperties.js";

describe("removeCommonProperties", () => {
    it("removes common properties in two objects", async () => {
        const src = { a: 1, b: 2, c: 3 };
        const target = { a: 1, b: 2, c: 3, d: 4 };
        removeCommonProperties(src, target);

        must(target).eql({ d: 4 });
        must(src).eql({ a: 1, b: 2, c: 3 });
    });

    it("removes common properties in three objects", async () => {
        const src = { a: 1, b: 2, c: 3 };
        const target1 = { a: 1, b: 2, c: 3, d: 4 };
        const target2 = { a: 1, b: 2, c: 9, d: 4 };

        removeCommonProperties(src, target1, target2);

        must(target1).eql({ c: 3, d: 4 });
        must(target2).eql({ c: 9, d: 4 });
        must(src).eql({ a: 1, b: 2, c: 3 });
    });

    it("removes common properties in two objects, even if they are nested", async () => {
        const src = { a: 1, b: 2, c: { d: 3 } };
        const target1 = { a: 1, b: 2, c: { d: 3 }, e: 4 };

        removeCommonProperties(src, target1);

        must(target1).eql({ e: 4 });
        must(src).eql({ a: 1, b: 2, c: { d: 3 } });
    });
});

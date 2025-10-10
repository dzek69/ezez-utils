import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { waitSync } from "./waitSync.js";

describe("wait", () => {
    it("doesn't return value", () => {
        must(waitSync(0)).be.equal(undefined); // eslint-disable-line @typescript-eslint/no-confusing-void-expression
    });

    it("waits given time", () => {
        const start1 = Date.now();
        waitSync(5);
        const end1 = Date.now();
        (end1 - start1).must.be.gte(5);

        const start2 = Date.now();
        waitSync(100);
        const end2 = Date.now();
        (end2 - start2).must.be.gte(100);
    });

    // @TODO test that nothing else could happen during wait
});

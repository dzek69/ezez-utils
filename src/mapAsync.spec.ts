import { mapAsync } from "./mapAsync.js";
import { waitSync } from "./waitSync.js";

const slowCb = (val: number) => {
    waitSync(5);
    return val + 1;
};

describe("mapAsync", () => {
    it("must return the same output as map", async () => {
        (await mapAsync([1, 2, 3], i => i + 1)).must.eql([2, 3, 4]);
        (await mapAsync([1, 2, 3], slowCb, 1, 1)).must.eql([2, 3, 4]);
    });

    it("must let other tasks to work", async () => {
        let i = 0,
            id;
        const bump = () => {
            i++;
            id = setTimeout(bump, 2);
            // let's make sure we're gonna consume every loop release (timeout lower than wait time) but just once
            // (timeout higher than wait time) - it's just to estimate values while testing
        };
        bump();

        await mapAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], slowCb, 10);

        i.must.be.gte(5);

        // now let's test standard, sync `map`
        i = 0;
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(slowCb);
        i.must.be.equal(0);

        clearTimeout(id);
    });

    // @TODO more tests, test callback params
});

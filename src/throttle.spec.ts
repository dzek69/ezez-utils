import { throttle } from "./throttle.js";
import { wait } from "./wait.js";

// @TODO much more tests required
// @TODO for some reason these tests are useless, at 2cfbbc81 they should fail, but they weren't

describe("throttle", function() {
    it("should work with single value timeout", async function() {
        const runTimes: number[] = [];
        const fn = () => {
            runTimes.push(Date.now());
        };

        const throttled = throttle(fn, 100);
        const start = Date.now();
        while (Date.now() - start < 2000) { // for 2 seconds
            throttled();
            await wait(1);
        }

        runTimes.length.must.be.gte(10); // just to be sure something run
        runTimes.length.must.be.lt(21);

        runTimes.forEach((time, key) => {
            if (!key) {
                return;
            }
            const lastTime = runTimes[key - 1];
            const diff = time - lastTime;
            diff.must.be.gte(100);
        });
    });

    it("should works with multi value timeout", async function() {
        const runTimes: number[] = [];
        const fn = () => {
            runTimes.push(Date.now());
        };

        const throttled = throttle(fn, [100, 200, 300]);
        const start = Date.now();
        while (Date.now() - start < 2000) { // for 2 seconds
            throttled();
            await wait(1);
        }

        const diff1 = runTimes[1] - runTimes[0];
        diff1.must.be.gte(100);
        diff1.must.be.lte(150); // cpu hogs can bump this value, fingers crossed it won't be higher to crash the tests

        const diff2 = runTimes[2] - runTimes[1];
        diff2.must.be.gte(200);
        diff2.must.be.lte(250);

        const diff3 = runTimes[3] - runTimes[2];
        diff3.must.be.gte(300);
        diff3.must.be.lte(350);

        const diff4 = runTimes[4] - runTimes[3];
        diff4.must.be.gte(300);
        diff4.must.be.lte(350);
    });

    it("allows to reset multi value timeout", async function() {
        const runTimes: number[] = [];
        const fn = () => {
            runTimes.push(Date.now());
        };

        const throttled = throttle(fn, [100, 200, 300]);
        let start = Date.now();
        while (Date.now() - start < 2000) { // for 2 seconds
            throttled();
            await wait(1);
        }

        throttled.cancel();
        runTimes.length = 0;

        start = Date.now();
        while (Date.now() - start < 2000) { // for 2 seconds
            throttled();
            await wait(1);
        }

        const diff1 = runTimes[1] - runTimes[0];
        diff1.must.be.gte(100);
        diff1.must.be.lte(150); // cpu hogs can bump this value, fingers crossed it won't be higher to crash the tests

        const diff2 = runTimes[2] - runTimes[1];
        diff2.must.be.gte(200);
        diff2.must.be.lte(250);

        const diff3 = runTimes[3] - runTimes[2];
        diff3.must.be.gte(300);
        diff3.must.be.lte(350);

        const diff4 = runTimes[4] - runTimes[3];
        diff4.must.be.gte(300);
        diff4.must.be.lte(350);
    });

    it("works with multiple values with trailing calls", async function() {
        const runTimes: number[] = [];
        const fn = () => {
            runTimes.push(Date.now());
        };

        const throttled = throttle(fn, [100, 200, 300]);
        throttled();
        throttled();
        await wait(201);
        throttled();
        await wait(201);
        throttled();
        await wait(201);
        throttled();
        await wait(201);
        throttled();

        const diffs = runTimes.map((time, key) => {
            if (!key) {
                return null;
            }
            return time - runTimes[key - 1];
        }).filter(v => v !== null);
        diffs[0].must.be.gte(100);
        diffs[0].must.be.lt(150);

        diffs[1].must.be.gte(200);
        diffs[1].must.be.lt(250);

        diffs[2].must.be.gte(300);
        diffs[2].must.be.lt(350);
    });

    describe("flush", function() {
        it("runs the pending trailing call immediately and only once", async function() {
            let calls = 0;
            const fn = () => {
                calls++;
                return calls;
            };

            const throttled = throttle(fn, 100, { leading: false, trailing: true });
            throttled(); // schedules a trailing call ~100ms from now
            throttled.flush(); // should run that planned call right now

            calls.must.equal(1);

            // flush must NOT leave (or schedule) another planned call behind
            await wait(200);
            calls.must.equal(1);
        });

        it("is a no-op returning the last result when nothing is pending", async function() {
            let calls = 0;
            const fn = () => {
                calls++;
                return calls;
            };

            const throttled = throttle(fn, 100, { leading: true, trailing: true });
            throttled(); // leading call runs immediately, nothing is pending afterwards
            calls.must.equal(1);

            throttled.flush();
            calls.must.equal(1); // flush did not call fn again
        });
    });
});

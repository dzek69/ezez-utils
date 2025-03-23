import { sortByMultiple } from "./sortByMultiple.js";

describe("sortByMultiple", () => {
    const items = [
        { height: 480, bitrate: 300 },
        { height: 720, bitrate: 100 },
        { height: 720, bitrate: 200 },
        { height: 720, bitrate: 50 },
    ];

    it("must sort asc", () => {
        items.sort(sortByMultiple(["height", "bitrate"])).must.eql([
            { height: 480, bitrate: 300 },
            { height: 720, bitrate: 50 },
            { height: 720, bitrate: 100 },
            { height: 720, bitrate: 200 },
        ]);
    });

    it("must sort desc", () => {
        items.sort(sortByMultiple(["height", "bitrate"], false)).must.eql([
            { height: 720, bitrate: 200 },
            { height: 720, bitrate: 100 },
            { height: 720, bitrate: 50 },
            { height: 480, bitrate: 300 },
        ]);
    });

    it("must sort with default value (example 1)", () => {
        const itemsMissing = [
            { height: 480, bitrate: 300 },
            { height: 720, bitrate: 100 },
            { height: 720 },
            { height: 720, bitrate: 200 },
        ];

        itemsMissing.sort(sortByMultiple(["height", "bitrate"], false, { bitrate: 999 })).must.eql([
            { height: 720 }, // bitrate assumed to be 999
            { height: 720, bitrate: 200 },
            { height: 720, bitrate: 100 },
            { height: 480, bitrate: 300 },
        ]);
    });

    it("must sort with default value (example 2)", () => {
        const itemsMissing = [
            { height: 480, bitrate: 300 },
            { height: 720, bitrate: 100 },
            { height: 720 },
            { height: 720, bitrate: 200 },
        ];

        itemsMissing.sort(sortByMultiple(["height", "bitrate"], true, { bitrate: 1 })).must.eql([
            { height: 480, bitrate: 300 },
            { height: 720 }, // bitrate assumed to be 1
            { height: 720, bitrate: 100 },
            { height: 720, bitrate: 200 },
        ]);
    });

    it("must sort each prop order separately", () => {
        items.sort(sortByMultiple(["height", "bitrate"], { height: true, bitrate: false })).must.eql([
            { height: 480, bitrate: 300 },
            { height: 720, bitrate: 200 },
            { height: 720, bitrate: 100 },
            { height: 720, bitrate: 50 },
        ]);
    });

    it("must sort each prop order separately (with missing)", () => {
        const itemsMissing = [
            { height: 480, bitrate: 300 },
            { height: 720, bitrate: 100 },
            { height: 720 },
            { height: 720, bitrate: 200 },
        ];

        itemsMissing.sort(sortByMultiple(["height", "bitrate"], { height: true, bitrate: false }, { bitrate: 150 })).must.eql([
            { height: 480, bitrate: 300 },
            { height: 720, bitrate: 200 },
            { height: 720 }, // bitrate assumed to be 150
            { height: 720, bitrate: 100 },
        ]);
    });
});

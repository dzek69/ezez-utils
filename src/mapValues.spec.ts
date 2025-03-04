import { mapValues as _mapValues } from "lodash";

import { mapValues, mapValuesUNSET } from "./mapValues.js";

const REMOVE = mapValuesUNSET;

describe("mapValues", () => {
    const square = v => v * v;

    const obj = {
        a: 5,
        b: 6,
    };
    const result = {
        a: 25,
        b: 36,
    };

    it("returns new object, behaves like lodash", () => {
        mapValues(obj, square).must.not.equal(obj);
        _mapValues(obj, square).must.not.equal(obj);
    });

    it("maps values, behaves like lodash", () => {
        mapValues(obj, square).must.eql(result);
        _mapValues(obj, square).must.eql(result);
    });

    it("skips inherited properties, behaves like lodash", () => {
        const Test = function() {};
        Test.prototype.nonOwn = 1;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const testInstance = new Test();
        testInstance.own = 2;
        const testInstanceResult = {
            own: 4,
        };

        mapValues(testInstance, square).must.eql(testInstanceResult);
        _mapValues(testInstance, square).must.eql(testInstanceResult);
    });

    it("skips non-enumerable properties, behaves like lodash", () => {
        const nonEnum = {
            enum: 1,
        };
        Object.defineProperty(nonEnum, "nonEnum", {
            enumerable: false,
            value: 5,
        });
        const nonEnumResult = {
            enum: 1,
        };

        mapValues(nonEnum, square).must.eql(nonEnumResult);
        _mapValues(nonEnum, square).must.eql(nonEnumResult);
    });

    it("keeps array an array, behaves NOT like lodash", () => {
        const array = [1, 5];
        array.property = 3;
        const arrayResult = [1, 25];
        arrayResult.property = 9;
        const arrayResultLodash = {
            0: 1,
            1: 25,
            property: 9,
        };

        mapValues(array, square).must.eql(arrayResult);
        _mapValues(array, square).must.eql(arrayResultLodash);
    });

    it("works on holey array, behaves NOT like lodash", () => {
        const holeyArray = [1,, 3]; // eslint-disable-line no-sparse-arrays
        const holeyArrayResult = [1,, 9]; // eslint-disable-line no-sparse-arrays
        const holeyArrayResultLodash = {
            0: 1,
            1: NaN,
            2: 9,
        };

        mapValues(holeyArray, square).must.eql(holeyArrayResult);
        _mapValues(holeyArray, square).must.eql(holeyArrayResultLodash);
    });

    it("allows filtering while mapping values", () => {
        const source = {
            title: "abc",
            price: 16.10,
            author: "dzek",
            items: [],
            data: {},
            category: null,
            description: "abcd",
        };

        mapValues(source, (value, key) => {
            const keyStartsWithCP = ["c", "p"].includes(key.substring(0, 1));
            const isString = typeof value === "string";
            if (!isString && !keyStartsWithCP) {
                return REMOVE;
            }
            if (typeof value === "number") {
                return value + 1;
            }
            if (key === "description") {
                return (value as string).toUpperCase();
            }
            return value;
        }).must.eql({
            title: "abc",
            price: 17.10,
            author: "dzek",
            category: null,
            description: "ABCD",
        });
    });

    it("crashes on nil values, behaves NOT like lodash", () => {
        (() => mapValues(null, square)).must.throw();
        (() => mapValues(undefined, square)).must.throw();

        (() => _mapValues(null, square)).must.not.throw();
        (() => _mapValues(undefined, square)).must.not.throw();
    });

    it("calls given method once per property", () => {
        {
            const source = {
                aaa: false,
            };

            let calls;
            calls = 0;

            mapValues(source, (value) => {
                calls++;
                return value;
            });

            calls.must.equal(1);
        }

        {
            const source = {
                aaa: false,
                title: "albert eats flowers",
            };

            let calls;
            calls = 0;

            mapValues(source, (value) => {
                calls++;
                return value;
            });

            calls.must.equal(2);
        }
    });

    it("leaves gaps in an array if some elements are removed", () => {
        const array = [1, "string", 1, "dog", 69];

        const res = mapValues(array, (val) => (typeof val === "string" ? REMOVE : val));

        res.must.eql([
            1, , 1, , 69, // eslint-disable-line no-sparse-arrays
        ]);
        ("0" in res).must.be.true();
        ("1" in res).must.be.false();
        ("2" in res).must.be.true();
        ("3" in res).must.be.false();
        ("4" in res).must.be.true();
    });
});

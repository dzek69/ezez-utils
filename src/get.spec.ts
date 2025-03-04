import { get as _get } from "lodash";

import { get } from "./get.js";

const otherObject = { a: 5 };
const testObject = {
    "product": {
        name: "abc",
        price: 123,
        value: undefined,
        empty: null,
        notANumber: NaN,
        object: otherObject,
    },
    "product[price]": 400,
    "name": "string",
};

const Test = function() {};
Test.prototype.nonOwn = 1;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const testInstance = new Test();
testInstance.own = 1;
Object.defineProperty(testInstance, "nonEnum", {
    enumerable: false,
    value: 15,
});

describe("get", () => {
    it("returns shallow property of an object, behaves like lodash", () => {
        const value = get(testObject, "name");
        value.must.equal("string");

        const _value = _get(testObject, "name");
        value.must.equal(_value);
    });

    it("returns deep property of an object using array, behaves like lodash", () => {
        const value = get(testObject, ["product", "name"]);
        value.must.equal("abc");

        const _value = _get(testObject, ["product", "name"]);
        value.must.equal(_value);
    });

    it("returns deep property of an object using dot-string, behaves like lodash", () => {
        const value = get(testObject, "product.name");
        value.must.equal("abc");

        const _value = _get(testObject, "product.name");
        value.must.equal(_value);
    });

    it("doesn't parse string as js code, behaves NOT like lodash", () => {
        // Lodash intention-guessing example, inconsistency detected
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const name = get(testObject, "product[name]");
        (name === undefined).must.be.true();

        const _name = _get(testObject, "product[name]"); // deep value
        _name.must.equal("abc");

        const price = get(testObject, "product[price]");
        price.must.be.equal(400);

        const _price = _get(testObject, "product[price]"); // shallow value
        _price.must.equal(400);
    });

    it("returns undefined when value is not found and default isn't provided, behaves like lodash", () => {
        const value = get(testObject, "product.something");
        (value === undefined).must.be.true();

        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const _value = _get(testObject, "product.something");
        (_value === undefined).must.be.true();
    });

    it("returns default value when property is missing, behaves like lodash", () => {
        const value = get(testObject, "product.something", 3);
        value.must.equal(3);

        const _value = _get(testObject, "product.something", 3);
        _value.must.equal(3);
    });

    it("returns undefined when found value is explicitly undefined, behaves NOT like lodash", () => {
        const value = get(testObject, "product.value", 3);
        (value === undefined).must.be.true();

        const _value = _get(testObject, "product.value", 3);
        _value.must.equal(3);
    });

    it("returns null when found value is explicitly null, behaves like lodash", () => {
        const value = get(testObject, "product.empty", 3);
        (value === null).must.be.true();

        const _value = _get(testObject, "product.empty", 3);
        (_value === null).must.be.true();
    });

    it("returns NaN when found value is NaN, behaves like lodash", () => {
        const value = get(testObject, "product.notANumber", 3);
        value.must.be.nan();

        const _value = _get(testObject, "product.notANumber", 3);
        _value.must.be.nan();
    });

    it("returns objects, behaves like lodash", () => {
        const value = get(testObject, "product.object");
        value.must.equal(otherObject);

        const _value = _get(testObject, "product.object");
        _value.must.equal(otherObject);
    });

    it("works on nulls, behaves like lodash", () => {
        const value = get(null, "product.object", 3);
        value.must.equal(3);

        const _value = _get(null, "product.object", 3);
        _value.must.equal(3);
    });

    it("works on undefined, behaves like lodash", () => {
        const value = get(undefined, "product.object", 3);
        value.must.equal(3);

        const _value = _get(undefined, "product.object", 3);
        _value.must.equal(3);
    });

    it("works on NaN, behaves like lodash", () => {
        const value = get(NaN, "product.object", 3);
        value.must.equal(3);

        const _value = _get(NaN, "product.object", 3);
        _value.must.equal(3);
    });

    it("returns inherited properties value, behaves like lodash", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const value = get(testInstance, "nonOwn", 3);
        value.must.equal(1);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const _value = _get(testInstance, "nonOwn", 3);
        _value.must.equal(1);
    });

    it("returns non-enumerable properties value, behaves like lodash", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const value = get(testInstance, "nonEnum", 3);
        value.must.equal(15);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const _value = _get(testInstance, "nonEnum", 3);
        _value.must.equal(15);
    });

    it("doesn't parse mixed array/dot-strings property selectors, behaves like lodash", () => {
        const value = get(testObject, ["product", "object.a"], "def");
        const value2 = get(testObject, "product.object.a", "def");
        value.must.equal("def");
        value2.must.equal(5);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const _value = _get(testObject, ["product", "object.a"], "def");
        _value.must.equal("def");
    });

    // @todo test Maps, Sets etc
});

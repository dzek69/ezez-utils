import { merge, mergeUNSET } from "./merge.js";

describe("merge", () => {
    it("merges two objects", () => {
        merge({ a: true }, { b: false }).must.eql({
            a: true,
            b: false,
        });
        merge({ a: true }, { a: false }).must.eql({
            a: false,
        });
        merge({ c: true }, { a: undefined, c: undefined }).must.eql({
            a: undefined,
            c: undefined,
        });
    });

    it("merges three objects", () => {
        merge({ a: true }, { b: false }, { c: "maybe" }).must.eql({
            a: true,
            b: false,
            c: "maybe",
        });
        merge({ a: true }, { a: false }, { a: true }).must.eql({
            a: true,
        });
        merge({ c: true }, { a: undefined, c: undefined }, { c: null, a: false }).must.eql({
            a: false,
            c: null,
        });
    });

    it("allows to unset value", () => {
        const result = merge({ c: true }, { c: mergeUNSET });
        result.must.not.have.property("c");
        result.must.eql({});
    });

    it("allows to overwrite unset value", () => {
        const result = merge({ c: true }, { c: mergeUNSET }, { c: true });
        result.must.eql({ c: true });
    });

    it("rejects arrays", () => {
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, [])).must.throw(TypeError);
    });

    it("rejects primitive types", () => {
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, "string")).must.throw(TypeError);
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, 555)).must.throw(TypeError);
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, false)).must.throw(TypeError);
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, Symbol("hi"))).must.throw(TypeError);
    });

    it("rejects functions", () => {
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, () => "hi")).must.throw(TypeError);
    });

    it("ignores nil", () => {
        (() => merge({ c: true }, { c: mergeUNSET }, { c: true }, undefined, null)).must.not.throw();
        merge({ c: true }, { c: mergeUNSET }, { c: true }, undefined, null).must.eql({
            c: true,
        });
    });

    it("unsets value if mergeUNSET is present on first object", function() {
        merge({ c: mergeUNSET }).must.eql({});
    });

    it("throws on a prototype-polluting __proto__ key and leaves Object.prototype clean", () => {
        (() => merge({}, JSON.parse('{"__proto__":{"polluted":1}}'))).must.throw(TypeError, /prototype-polluting/u);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (({} as any).polluted === undefined).must.be.true();
    });

    it("throws on constructor/prototype keys from untrusted input (fail-fast)", () => {
        (() => merge({ a: 1 }, JSON.parse('{"constructor":"x","b":2}'))).must.throw(TypeError, /prototype-polluting/u);
        (() => merge({ a: 1 }, JSON.parse('{"prototype":"y","b":2}'))).must.throw(TypeError, /prototype-polluting/u);
    });
});

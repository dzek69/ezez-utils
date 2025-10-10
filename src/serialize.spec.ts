import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import type { CustomSerializers } from "./serialize";

import { serialize } from "./serialize";

interface Test {
    a: string;
}

class Person {
    public name: string;

    public constructor(name: string) {
        this.name = name;
    }
}

describe("serialize", () => {
    it("can serialize primitives", async () => {
        must(serialize("test")).equal(`"s:test"`);
        must(serialize(123)).equal(`"n:123"`);
        must(serialize(123n)).equal(`"i:123"`);
        must(serialize(undefined)).equal(`"u:"`);
        must(serialize(true)).equal(`"b:1"`);
        must(serialize(false)).equal(`"b:"`);
        must(serialize(null)).equal(`"l:"`);
    });

    it("can serialize arrays", async () => {
        must(serialize(["a", "b", "c"])).equal(`["s:a","s:b","s:c"]`);
        must(serialize([1, 2n, undefined, true, false, null])).equal(`["n:1","i:2","u:","b:1","b:","l:"]`);

        // deep arrays:
        must(serialize([1, [2, [3, [4, [5]]]]])).equal(`["n:1",["n:2",["n:3",["n:4",["n:5"]]]]]`);
    });

    it("can serialize objects", async () => {
        must(serialize({ a: "a", b: "b", c: "c" })).equal(`{"a":"s:a","b":"s:b","c":"s:c"}`);

        const a: Test = { a: "a" };
        must(serialize(a)).equal(`{"a":"s:a"}`);
    });

    it("supports custom serializers", async () => {
        const customSerializers: CustomSerializers = {
            p: (value) => {
                if (value instanceof Person) {
                    return value.name;
                }
                return null;
            },
        };

        must(serialize(new Person("John"), customSerializers)).equal(`"p:John"`);
        must(serialize({ a: new Person("John") }, customSerializers)).equal(`{"a":"p:John"}`);
    });

    it("throws on unknown data type", () => {
        const x = Symbol("x");

        must(() => serialize(x)).throw("Unsupported data type: symbol");
    });

    it("allows custom serializers to support primitives", () => {
        const customSerializers: CustomSerializers = {
            sym: (value) => {
                if (typeof value === "symbol") {
                    return String(value);
                }
                return null;
            },
        };

        must(serialize(Symbol("x"), customSerializers)).equal(`"sym:Symbol(x)"`);
        must(serialize({ a: Symbol("x") }, customSerializers)).equal(`{"a":"sym:Symbol(x)"}`);
    });

    it("returns the same for any order of props", () => {
        const a = { a: 1, b: 2 };
        const b = { b: 2, a: 1 };

        must(serialize(a)).equal(serialize(b));
    });

    it("allows serializing dates and other objects containing .toJSON", async () => {
        const date = new Date(1714390008941);
        must(serialize(date, {
            D: (value) => {
                if (value instanceof Date) {
                    return String(value.getTime());
                }
                return null;
            },
        })).equal(`"D:1714390008941"`);
    });

    it("should avoid excessive calls to custom serializers", async () => {
        const customSerializers: CustomSerializers = {
            p: (value) => {
                // console.log("Called with", typeof value, value);
                if (value instanceof Person) {
                    return value.name;
                }
                return null;
            },
        };

        const p1 = new Person("John");
        const spy = jest.spyOn(customSerializers, "p");

        serialize({
            a: [p1],
            b: 1,
            c: {
                d: true,
                e: p1,
            },
        }, customSerializers);
        expect(spy).toHaveBeenCalledTimes(4);
    });

    it("should not crash on unknown instances but serialize as plain object", async () => {
        const p1 = new Person("John");
        must(serialize(p1)).equal(`{"name":"s:John"}`);
    });
});

import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import type { CustomDeserializers } from "./deserialize";

import { deserialize } from "./deserialize";

class Person {
    public name: string;

    public constructor(name: string) {
        this.name = name;
    }
}

describe("deserialize", () => {
    it("can deserialize primitives", async () => {
        must(deserialize(`"s:test"`)).equal("test");
        must(deserialize(`"n:123"`)).equal(123);
        must(deserialize(`"i:123"`)).equal(123n);
        must(deserialize(`"u:"`)).equal(undefined);
        must(deserialize(`"b:1"`)).equal(true);
        must(deserialize(`"b:"`)).equal(false);
        must(deserialize(`"l:"`)).equal(null);
    });

    it("can deserialize arrays", () => {
        must(deserialize(`["s:a","s:b","s:c"]`)).eql(["a", "b", "c"]);
        must(deserialize(`["n:1","i:2","u:","b:1","b:","l:"]`)).eql([1, 2n, undefined, true, false, null]);

        // deep arrays:
        must(deserialize(`["n:1",["n:2",["n:3",["n:4",["n:5"]]]]]`)).eql([1, [2, [3, [4, [5]]]]]);
    });

    it("can deserialize objects", () => {
        must(deserialize(`{"a":"s:a","b":"s:b","c":"s:c"}`)).eql({ a: "a", b: "b", c: "c" });
    });

    it("supports custom deserializers", () => {
        const customDeserializers: CustomDeserializers = {
            p: (value) => {
                return new Person(value);
            },
        };

        const p1 = deserialize<Person>(`"p:John"`, customDeserializers);
        must(p1).be.instanceOf(Person);
        must(p1.name).equal("John");

        const res = deserialize<{ a: Person }>(`{"a":"p:John"}`, customDeserializers);
        const p2 = res.a;
        must(p2).be.instanceOf(Person);
        must(p2.name).equal("John");

        must(res).eql({ a: p2 });
    });

    it("allows custom deserializers to support primitives", () => {
        const customSerializers: CustomDeserializers = {
            sym: (value) => {
                return Symbol.for(value);
            },
        };

        // must(serialize(Symbol("x"), customSerializers)).equal(`"sym:x"`);
        must(deserialize(`"sym:x"`, customSerializers)).equal(Symbol.for("x"));
    });

    it("throws on unknown data type", () => {
        must(() => deserialize(`"v:test"`)).throw("Unsupported data type: v");
    });

    it("supports deserializers with things like Date", async () => {
        const customSerializers: CustomDeserializers = {
            D: (value) => {
                return new Date(Number(value));
            },
        };

        const result = deserialize(`"D:1714398481437"`, customSerializers);
        must(result).be.instanceof(Date);
        must(result.getTime()).equal(1714398481437);
    });
});

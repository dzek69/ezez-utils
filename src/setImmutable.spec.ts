import { setImmutable } from "./setImmutable.js";

describe("setImmutable", () => {
    it("updates existing value", () => {
        const obj = {
            title: "Hello",
        };
        const result = setImmutable(obj, "title", "World");
        obj.must.not.equal(result);
        obj.title.must.equal("Hello");
        result.title.must.equal("World");
    });

    it("adds new value", () => {
        const obj = {
            title: "Hello",
        };
        const result = setImmutable(obj, "name", "World");
        obj.must.not.equal(result);
        obj.must.eql({
            title: "Hello",
        });
        result.must.eql({
            title: "Hello",
            name: "World",
        });
    });

    it("matches the value when path is type number", () => {
        setImmutable({ a: 1 }, 1, "World").must.eql({
            a: 1,
            1: "World",
        });
        setImmutable([1], 1, "World").must.eql([
            1, "World",
        ]);
    });

    it("disallows other types than string, number or array of strings and numbers", () => {
        (() => setImmutable({}, null, "test")).must.throw();
        (() => setImmutable({}, undefined, "test")).must.throw();
        (() => setImmutable({}, () => {}, "test")).must.throw();
        (() => setImmutable({}, {}, "test")).must.throw();
        (() => setImmutable({}, Symbol("abc"), "test")).must.throw();

        (() => setImmutable({}, [1, "s"], "test")).must.not.throw();

        (() => setImmutable({}, [1, "s", []], "test")).must.throw();
        (() => setImmutable({}, [() => {}], "test")).must.throw();
    });

    it("disallows empty path paths", () => {
        (() => setImmutable({}, "", "test")).must.throw();
        (() => setImmutable({}, ["a", "", "b"], "test")).must.throw();
        (() => setImmutable({}, ["a", "b", ""], "test")).must.throw();
        (() => setImmutable({}, [], "test")).must.throw();
        (() => setImmutable({}, "a.b..c", "test")).must.throw();
    });

    it("deeply sets value", () => {
        const object = {
            data: {
                title: "666",
            },
            other: {
                a: 5,
            },
        };
        const newObject = setImmutable(object, "data.name", "santa");

        object.must.not.equal(newObject);
        object.data.must.not.equal(newObject.data);

        object.other.must.equal(newObject.other);

        newObject.must.eql({
            data: {
                title: "666",
                name: "santa",
            },
            other: {
                a: 5,
            },
        });
        object.must.eql({
            data: {
                title: "666",
            },
            other: {
                a: 5,
            },
        });
    });

    it("keeps arrays in place", () => {
        const object = {
            items: [0, 1],
        };
        const newObject = setImmutable(object, "items.2", 2);

        newObject.must.eql({
            items: [0, 1, 2],
        });
    });

    it("replaces functions with objects", () => {
        const fn = () => {};
        fn.publicValue = 5;

        const object = {
            fn,
        };

        const result = setImmutable(object, "fn.value", 666);

        result.fn.must.be.an.object();
        result.fn.must.not.be.a.function();
        result.fn.must.not.equal(fn);
        result.must.eql({
            fn: {
                publicValue: 5,
                value: 666,
            },
        });
    });

    it("adds objects if not existing on the way", () => {
        const object = {
            data: {},
        };

        const result = setImmutable(object, "data.gallery.items", [1, 2, 3]);

        object.must.not.equal(result);
        object.data.must.not.equal(result.data);
        object.must.eql({
            data: {},
        });
        result.must.eql({
            data: {
                gallery: {
                    items: [1, 2, 3],
                },
            },
        });
    });

    it("replaces primitives on the way", () => {
        {
            const object = {
                data: "string",
            };

            const result = setImmutable(object, "data.gallery.items", [1, 2, 3]);

            result.must.eql({
                data: {
                    gallery: {
                        items: [1, 2, 3],
                    },
                },
            });
        }

        {
            const object = {
                data: 45678,
            };

            const result = setImmutable(object, "data.gallery.items", [1, 2, 3]);

            result.must.eql({
                data: {
                    gallery: {
                        items: [1, 2, 3],
                    },
                },
            });
        }
    });

    it("works with primitives as source", () => {
        setImmutable(undefined, "hi", "mom").must.eql({
            hi: "mom",
        });

        setImmutable(null, "hi", "mom").must.eql({
            hi: "mom",
        });

        setImmutable(69, "hi", "mom").must.eql({
            hi: "mom",
        });
    });

    it("creates an object when using numeric key and source object has missing data there", () => {
        const result = setImmutable(null, ["data", 5], 100);
        result.data.must.not.be.an.array();
        result.must.eql({
            data: {
                5: 100,
            },
        });
    });

    it("doesn't parse path string as js code", () => {
        const result = setImmutable(null, "data[title]", "Horror movie");
        result.must.not.have.property("data");
        result.must.have.property("data[title]");
        result.must.eql({
            "data[title]": "Horror movie",
        });
    });

    it("allows dot separated path", () => {
        setImmutable(null, "data.title", "Horror movie").must.eql({
            data: {
                title: "Horror movie",
            },
        });
    });

    it("allows array as path", () => {
        setImmutable(null, ["data", "title"], "Horror movie").must.eql({
            data: {
                title: "Horror movie",
            },
        });
    });

    it("doesn't parse mixed array/dot-strings paths", () => {
        const result = setImmutable(null, ["data", "title.name"], "Horror movie");
        result.data.must.not.have.property("title");
        result.data.must.have.property("title.name");
        result.must.eql({
            data: {
                "title.name": "Horror movie",
            },
        });
    });

    it("throws on prototype-polluting keys and keeps Object.prototype clean", () => {
        (() => {
            setImmutable({}, "__proto__.polluted", "yes");
        }).must.throw(TypeError, /prototype-polluting/u);
        (() => {
            setImmutable({}, "constructor.prototype.polluted", "yes");
        }).must.throw(TypeError, /prototype-polluting/u);
        (() => {
            setImmutable({}, ["a", "__proto__", "z"], "yes");
        }).must.throw(TypeError, /prototype-polluting/u);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (({} as any).polluted === undefined).must.be.true();
    });
});

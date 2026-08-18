import { set as _set } from "lodash";

import { set } from "./set.js";

describe("set", () => {
    it("replaces existing value, behaves like lodash", () => {
        lodash: {
            const obj = {
                title: "Hello",
            };
            _set(obj, "title", "World");
            obj.title.must.equal("World");
        }

        bottom: {
            const obj = {
                title: "Hello",
            };
            set(obj, "title", "World");
            obj.title.must.equal("World");
        }
    });

    it("adds new value, behaves like lodash", () => {
        lodash: {
            const obj = {
                title: "Hello",
            };
            _set(obj, "name", "World");
            obj.title.must.equal("Hello");
            obj.name.must.equal("World");
        }

        bottom: {
            const obj = {
                title: "Hello",
            };
            set(obj, "name", "World");
            obj.title.must.equal("Hello");
            obj.name.must.equal("World");
        }
    });

    it("allows deep set, behaves like lodash", () => {
        lodash: {
            const obj = {
                data: {
                    title: "Bye",
                },
            };

            const dataBefore = obj.data;

            _set(obj, "data.title", "Hi");

            obj.data.title.must.equal("Hi");
            obj.data.must.equal(dataBefore);
        }

        bottom: {
            const obj = {
                data: {
                    title: "Bye",
                },
            };

            const dataBefore = obj.data;

            set(obj, "data.title", "Hi");

            obj.data.title.must.equal("Hi");
            obj.data.must.equal(dataBefore);
        }
    });

    it("adds objects if not existing on the way, behaves like lodash", () => {
        lodash1: {
            const obj = {
                data: null,
            };
            _set(obj, "data.title", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.equal("Hi");
        }

        lodash2: {
            const obj = {};
            _set(obj, "data.title.short", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.be.an.object();
            obj.data.title.short.must.equal("Hi");
        }

        bottom1: {
            const obj = {
                data: null,
            };
            set(obj, "data.title", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.equal("Hi");
        }

        bottom2: {
            const obj = {};
            set(obj, "data.title.short", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.be.an.object();
            obj.data.title.short.must.equal("Hi");
        }
    });

    it("replaces primitives with objects on the way, behaves like lodash", () => {
        lodash1: {
            const obj = {
                data: true,
            };
            _set(obj, "data.title.short", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.be.an.object();
            obj.data.title.short.must.equal("Hi");
        }

        lodash2: {
            const obj = {
                data: "empty",
            };
            _set(obj, "data.title.short", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.be.an.object();
            obj.data.title.short.must.equal("Hi");
        }

        bottom1: {
            const obj = {
                data: true,
            };
            set(obj, "data.title.short", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.be.an.object();
            obj.data.title.short.must.equal("Hi");
        }

        bottom2: {
            const obj = {
                data: "empty",
            };
            set(obj, "data.title.short", "Hi");
            obj.data.must.be.an.object();
            obj.data.title.must.be.an.object();
            obj.data.title.short.must.equal("Hi");
        }
    });

    it("doesn't crash on nulls as source, but returns new object, behaves NOT like lodash", () => {
        lodash: {
            const obj = null;
            (() => {
                _set(obj, "data.title.short", "Hi");
            }).must.not.throw();

            const newObj = _set(obj, "data.title.short", "Hi");
            (newObj === null).must.be.true();
        }

        bottom: {
            const obj = null;
            (() => {
                set(obj, "data.title.short", "Hi");
            }).must.not.throw();

            const newObj = set(obj, "data.title.short", "Hi");
            newObj.must.be.an.object();
            newObj.data.title.short.must.equal("Hi");
        }
    });

    it("doesn't crash on primitives as source", () => {
        lodash1: {
            const obj = "hello";
            (() => {
                _set(obj, "data.title.short", "Hi");
            }).must.not.throw();

            const newObj = _set(obj, "data.title.short", "Hi");
            newObj.must.equal("hello");
        }

        lodash2: {
            const obj = 88;
            (() => {
                _set(obj, "data.title.short", "Hi");
            }).must.not.throw();

            const newObj = _set(obj, "data.title.short", "Hi");
            newObj.must.equal(88);
        }

        bottom1: {
            const obj = "hello";
            (() => {
                set(obj, "data.title.short", "Hi");
            }).must.not.throw();

            const newObj = set(obj, "data.title.short", "Hi");
            newObj.must.be.an.object();
            newObj.data.title.short.must.equal("Hi");
        }

        bottom2: {
            const obj = 88;
            (() => {
                set(obj, "data.title.short", "Hi");
            }).must.not.throw();

            const newObj = set(obj, "data.title.short", "Hi");
            newObj.must.be.an.object();
            newObj.data.title.short.must.equal("Hi");
        }
    });

    it("works on functions as source, behaves like lodash", () => {
        lodash: {
            const obj = () => {};
            (() => {
                _set(obj, "lo.da", "sh");
            }).must.not.throw();

            obj.lo.da.must.equal("sh");
        }

        bottom: {
            const obj = () => {};
            (() => {
                set(obj, "lo.da", "sh");
            }).must.not.throw();

            obj.lo.da.must.equal("sh");
        }
    });

    it("creates an object when numeric index is used and target isn't set, behaves NOT like lodash", () => {
        lodash1: {
            const obj = {};
            _set(obj, ["items", 5, "title"], "Jan Padeusz");
            obj.items.must.be.an.array();
            obj.items.must.eql([,,,,, // eslint-disable-line no-sparse-arrays
                {
                    title: "Jan Padeusz",
                }]);
        }

        lodash2: {
            const obj = {};
            _set(obj, "items.5.title", "Jan Padeusz");
            obj.items.must.be.an.array();
            obj.items.must.eql([,,,,, // eslint-disable-line no-sparse-arrays
                {
                    title: "Jan Padeusz",
                }]);
        }

        bottom1: {
            const obj = {};
            set(obj, ["items", 5, "title"], "Jan Padeusz");
            obj.items.must.not.be.an.array();
            obj.items.must.eql({
                5: {
                    title: "Jan Padeusz",
                },
            });
        }

        bottom2: {
            const obj = {};
            set(obj, "items.5.title", "Jan Padeusz");
            obj.items.must.not.be.an.array();
            obj.items.must.eql({
                5: {
                    title: "Jan Padeusz",
                },
            });
        }
    });

    it("doesn't parse path string as js code, behaves NOT like lodash", () => {
        lodash: {
            const obj = {};
            _set(obj, "hello[world]", "is it me you're looking for?");
            obj.hello.world.must.equal("is it me you're looking for?");
        }

        bottom: {
            const obj = {};
            set(obj, "hello[world]", "is it me you're looking for?");
            obj.must.not.have.property("hello");
            obj.must.have.property("hello[world]");
            obj["hello[world]"].must.equal("is it me you're looking for?");
        }
    });

    it("allow dot separated path, behaves like lodash", () => {
        lodash: {
            const obj = {};
            _set(obj, "hello.world", "is it me you're looking for?");
            obj.hello.world.must.equal("is it me you're looking for?");
        }

        bottom: {
            const obj = {};
            set(obj, "hello.world", "is it me you're looking for?");
            obj.hello.world.must.equal("is it me you're looking for?");
        }
    });

    it("allow arrays as path, behaves like lodash", () => {
        lodash: {
            const obj = {};
            _set(obj, ["hello", "world"], "is it me you're looking for?");
            obj.hello.world.must.equal("is it me you're looking for?");
        }

        bottom: {
            const obj = {};
            set(obj, ["hello", "world"], "is it me you're looking for?");
            obj.hello.world.must.equal("is it me you're looking for?");
        }
    });

    it("doesn't parse mixed array/dot-strings paths, behaves like lodash", () => {
        lodash: {
            const obj = {};
            _set(obj, ["hello", "world.5"], "is it me you're looking for?");
            obj.hello.must.not.have.property("world");
            obj.hello.must.have.property("world.5");
            obj.hello["world.5"].must.equal("is it me you're looking for?");
        }

        bottom: {
            const obj = {};
            set(obj, ["hello", "world.5"], "is it me you're looking for?");
            obj.hello.must.not.have.property("world");
            obj.hello.must.have.property("world.5");
            obj.hello["world.5"].must.equal("is it me you're looking for?");
        }
    });

    // @todo test Maps, Sets, etc.

    it("throws on a prototype-polluting __proto__ path and keeps Object.prototype clean", () => {
        const run = () => {
            set({}, "__proto__.pollutedProtoSet", "yes");
        };
        run.must.throw(TypeError, /prototype-polluting/u);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (({} as any).pollutedProtoSet === undefined).must.be.true();
    });

    it("throws on a constructor.prototype path", () => {
        const run = () => {
            set({}, "constructor.prototype.pollutedCtorSet", "yes");
        };
        run.must.throw(TypeError, /prototype-polluting/u);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (({} as any).pollutedCtorSet === undefined).must.be.true();
    });

    it("throws when a forbidden key appears anywhere in the path (fail-fast, no partial write)", () => {
        const obj = {};
        const run = () => {
            set(obj, "a.constructor.z", 1);
        };
        run.must.throw(TypeError, /prototype-polluting/u);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (({} as any).z === undefined).must.be.true();
        obj.must.eql({});
    });
});

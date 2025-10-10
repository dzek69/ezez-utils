import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { replaceDeepByFn } from "./replaceDeepByFn";

class MyClass {
    public value: number;

    public constructor(value: number) {
        this.value = value;
    }
}

describe("replaceDeepByFn", () => {
    it("should replace given value in a deep object", () => {
        const source = [
            99,
            100,
            {
                favouriteBook: {
                    title: "The Ring of The Lord",
                    price: 100,
                },
                otherBooks: [
                    {
                        title: "Parry Hotter",
                        price: 50,
                        tag: "100",
                    },
                    {
                        title: "The Hobbyte 100",
                        price: [100],
                    },
                ],
            },
        ];

        must(replaceDeepByFn(source, v => v === 100, () => 200)).eql([
            99,
            200,
            {
                favouriteBook: {
                    title: "The Ring of The Lord",
                    price: 200,
                },
                otherBooks: [
                    {
                        title: "Parry Hotter",
                        price: 50,
                        tag: "100",
                    },
                    {
                        title: "The Hobbyte 100",
                        price: [200],
                    },
                ],
            },
        ]);
    });

    it("should leave primitives as-is unless they equal to the search value", () => {
        must(replaceDeepByFn(100, v => v === 200, () => 300)).equal(100);
        must(replaceDeepByFn(200, v => v === 200, () => 300)).equal(300);
        must(replaceDeepByFn("100", v => v === 200, () => 300)).equal("100");
        // ESLINT BUG: (see replaceDeep.spec.ts)
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        must(replaceDeepByFn(undefined, v => v === 200, () => 300)).equal(undefined);
        must(replaceDeepByFn(null, v => v === 200, () => 300)).equal(null);
        must(replaceDeepByFn(true, v => v === 200, () => 300)).equal(true);
        must(replaceDeepByFn(666n, v => v === 200, () => 300)).equal(666n);
    });

    it("should work with nans", async () => {
        must(replaceDeepByFn({
            a: NaN,
            b: 123,
        }, v => Number.isNaN(v), () => 300)).eql({
            a: 300,
            b: 123,
        });
    });

    it("should allow to replace nils", async () => {
        must(replaceDeepByFn(null, v => v === null, () => 300)).equal(300);
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        must(replaceDeepByFn(undefined, v => v === undefined, () => 300)).equal(300);
    });

    it("does not mutate the original object", () => {
        const source = {
            a: 1,
            b: {
                c: 2,
            },
        };
        const result = replaceDeepByFn(source, v => v === 2, () => 3);
        must(result).not.equal(source);
        must(result.b).not.equal(source.b);
        must(result).eql({
            a: 1,
            b: {
                c: 3,
            },
        });
    });

    it("does not mutate original array", async () => {
        const source = [1, 2, 3, [2, 3]];
        const result = replaceDeepByFn(source, v => v === 2, () => 4);
        must(result).not.equal(source);
        must(result[3]).not.equal(source[3]);
        must(result).eql([1, 4, 3, [4, 3]]);
    });

    it("mutates the original object when enabled", () => {
        const source = {
            a: 1,
            b: {
                c: 2,
            },
        };
        const result = replaceDeepByFn(source, v => v === 2, () => 3, { mutate: true });
        must(result).equal(source);
        must(result.b).equal(source.b);
        must(result).eql({
            a: 1,
            b: {
                c: 3,
            },
        });
    });

    it("mutates original array when enabled", async () => {
        const source = [1, 2, 3, [2, 3]];
        const result = replaceDeepByFn(source, v => v === 2, () => 4, { mutate: true });
        must(result).equal(source);
        must(result[3]).equal(source[3]);
        must(result).eql([1, 4, 3, [4, 3]]);
    });

    it("does not get into instances by default", async () => {
        const source = new MyClass(100);
        const result = replaceDeepByFn(source, v => v === 100, () => 200);
        must(result).equal(source);
        must(source.value).equal(100);
    });

    it("gets into instances when allowed", async () => {
        const source = new MyClass(100);
        const result = replaceDeepByFn(source, v => v === 100, () => 200, {
            replaceInstancesProps: true,
            mutate: true,
        });
        must(result).equal(source);
        must(source.value).equal(200);
    });

    it("requires `mutate` option if `replaceInstancesProps` is defined", async () => {
        const source = new MyClass(100);
        must(() => replaceDeepByFn(source, v => v === 100, () => 200, {
            replaceInstancesProps: true,
            mutate: false,
        })).throw("`replaceInstancesProps` option requires `mutate` to be enabled");
    });
});

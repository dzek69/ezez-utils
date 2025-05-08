import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { unserializeFromBuffer } from "./unserializeFromBuffer";
import { serializeToBuffer } from "./serializeToBuffer";

const serialize = serializeToBuffer.bind(null, Buffer, []);
const unserialize = unserializeFromBuffer.bind(null, Buffer, []);

describe("serialization", () => {
    it("serializes basic string", async () => {
        const data = ["TEST"];
        must(unserialize(serialize(...data))).eql(data);
    });

    it("serializes json", async () => {
        const data = [
            { a: 1, b: 2 },
        ];
        must(unserialize(serialize(...data))).eql(data);
    });

    it("serializes multiple data", async () => {
        const data = [
            "hey",
            3,
            { a: 1 },
            Buffer.from("test"),
        ];
        const result = unserialize(serialize(...data));
        const buffer = result.pop() as Buffer;
        must(result).eql(data.slice(0, 3));
        must(buffer).be.instanceof(Buffer);
        must(buffer.toString()).equal("test");
    });

    it("serializes undefined", async () => {
        const data = [undefined];
        const result = unserialize(serialize(...data));
        must(result).have.length(1);
        must(result[0]).be.undefined();
    });

    it("serializes JSON-looking string", async () => {
        const data = [`"TEST"`];
        must(unserialize(serialize(...data))).eql(data);
    });

    it("serializes huge object", async () => {
        const data = [{
            a: 1,
            b: false,
            c: true,
            d: "test",
            e: null,
            f: undefined,
            g: [1, 2, 3],
            h: { a: 1, b: [2] },
        }];
        must(unserialize(serialize(...data))).eql(data);
    });
});

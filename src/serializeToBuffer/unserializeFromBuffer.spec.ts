import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { unserializeFromBuffer } from "./unserializeFromBuffer";

const unserialize = unserializeFromBuffer.bind(null, Buffer, []);

describe("unserialize", () => {
    it("unserializes basic string", async () => {
        must(unserialize(Buffer.from([0x34, 0x66, 0x00, 0x74, 0x65, 0x73, 0x74, 0x00]))).eql(["test"]);
    });

    it("unserializes multiple strings", async () => {
        must(unserialize(Buffer.from([
            0x34, 0x66, 0x00, 0x74, 0x65, 0x73, 0x74, 0x00,
            0x34, 0x66, 0x00, 0x74, 0x65, 0x73, 0x74, 0x00,
        ]))).eql(["test", "test"]);
    });

    it("unserializes buffer", async () => {
        const result = unserialize(Buffer.from([0x34, 0x74, 0x00, 0x74, 0x65, 0x73, 0x74, 0x00]));
        must(result.length).equal(1);
        must(result[0]).instanceof(Buffer);
        must((result[0] as Buffer).toString()).equal("test");
    });

    it("unserializes both buffer and string", async () => {
        const result = unserialize(Buffer.from([
            0x34, 0x74, 0x00, 0x74, 0x65, 0x73, 0x74, 0x00,
            0x34, 0x66, 0x00, 0x74, 0x65, 0x73, 0x74, 0x00,
        ]));

        must(result.length).equal(2);

        must(result[0]).instanceof(Buffer);
        must((result[0] as Buffer).toString()).equal("test");

        must(result[1]).equal("test");
    });

    it("unserializes JSON-looking string as string", async () => {
        must(unserialize(
            Buffer.from([0x36, 0x66, 0x00, 0x22, 0x74, 0x65, 0x73, 0x74, 0x22, 0x00]),
        )).eql([`"test"`]);
    });

    it("unserializes JSON-serialized string as string", async () => {
        must(unserialize(Buffer.from([
            0x38, 0x66, 0x00, 0x22, 0x73, 0x3a, 0x74, 0x65, 0x73, 0x74, 0x22, 0x00,
        ]))).eql([`"s:test"`]);
    });

    it("unserializes JSON-serialized json as string", async () => {
        must(unserialize(Buffer.from([
            0x38, 0x6a, 0x00, 0x22, 0x73, 0x3a, 0x74, 0x65, 0x73, 0x74, 0x22, 0x00,
        ]))).eql(["test"]);
    });

    it("unserializes number as number", async () => {
        must(unserialize(Buffer.from([
            0x35, 0x6a, 0x00, 0x22, 0x6e, 0x3a, 0x31, 0x22, 0x00,
        ]))).eql([1]);
    });

    it("unserializes multiple various arguments", async () => {
        must(unserialize(Buffer.from([
            0x35, 0x66, 0x00, 0x70, 0x69, 0x6e, 0x67, 0x32, 0x00,
            0x35, 0x6a, 0x00, 0x22, 0x6e, 0x3a, 0x35, 0x22, 0x00,
            0x35, 0x6a, 0x00, 0x22, 0x62, 0x3a, 0x31, 0x22, 0x00,
            0x35, 0x6a, 0x00, 0x22, 0x6e, 0x3a, 0x36, 0x22, 0x00,
            0x35, 0x6a, 0x00, 0x22, 0x6e, 0x3a, 0x39, 0x22, 0x00,
        ]))).eql(["ping2", 5, true, 6, 9]);
    });
});

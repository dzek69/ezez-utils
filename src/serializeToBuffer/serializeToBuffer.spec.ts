import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { serializeToBuffer } from "./serializeToBuffer";

const serialize = serializeToBuffer.bind(null, Buffer, []);

describe("serialize", () => {
    it("serializes basic string", async () => {
        // len 4, type string, data "test", separator
        must(serialize("test").toString("hex")).equal("3466007465737400");
    });

    it("serializes multiple strings", async () => {
        // len 4, type string, data "test", separator
        must(serialize("test", "test").toString("hex")).equal("34660074657374003466007465737400");
    });

    it("serializes basic buffer", async () => {
        // len 4, type bin, data "test", separator
        must(serialize(Buffer.from("test")).toString("hex")).equal("3474007465737400");
    });

    it("serializes both buffer and string", async () => {
        // len 4, type bin, data "test", separator, len 4, bin false, data "test", separator
        must(serialize(Buffer.from("test"), "test").toString("hex")).equal("34740074657374003466007465737400");
    });

    it("serializes JSON-looking string", async () => {
        // len 6, type string, data "test", separator
        must(serialize(`"test"`).toString("hex")).equal("36660022746573742200");
    });

    it("serializes JSON-serialized string", async () => {
        // len 8, type string, data "test", separator
        must(serialize(`"s:test"`).toString("hex")).equal("38660022733a746573742200");
    });

    it("serializes number", async () => {
        // len 5, type json, data "n:1", separator
        must(serialize(1).toString("hex")).equal("356a00226e3a312200");
    });
    // TODO more tests
});

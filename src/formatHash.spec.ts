import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { formatHash } from "./formatHash";

describe("formatHash", () => {
    it("should format basic hash string", async () => {
        must(formatHash("abcdef123456")).equal("abcd…3456");
    });

    it("should allow to change side size", async () => {
        must(formatHash("abcdef123456", 3)).equal("abc…456");
    });

    it("should allow to change separator", async () => {
        must(formatHash("abcdef123456", 3, "---")).equal("abc---456");
    });

    it("should return original string if too short", async () => {
        must(formatHash("abcd")).equal("abcd");
        must(formatHash("abcdef", 4)).equal("abcdef");
        must(formatHash("12341234", 4)).equal("12341234");
    });

    it("should replace the middle chars even when cutoff chars equals in length to separator length", async () => {
        must(formatHash("123451234", 4)).equal("1234…1234");
    });

    it("should work with empty string", async () => {
        must(formatHash("")).equal("");
    });
});


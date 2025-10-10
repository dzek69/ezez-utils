import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { trimStart } from "./trimStart";

describe("trimStart", () => {
    it("should trim single character from the start of the string", async () => {
        must(trimStart("?abc", "?")).equal("abc");
        must(trimStart("aaabc", "a")).equal("bc");
    });

    it("should trim multiple characters as a whole", async () => {
        must(trimStart("abc", "ab")).equal("c");

        must(trimStart("aabcc", "ab")).equal("aabcc");
        must(trimStart("babcb", "ab")).equal("babcb");
    });

    it("should trim into empty string if needed", async () => {
        must(trimStart("abc", "abc")).equal("");
        must(trimStart("aaa", "a")).equal("");
    });
});

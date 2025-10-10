import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { trimEnd } from "./trimEnd";

describe("trimEnd", () => {
    it("should trim single character from the end of the string", async () => {
        must(trimEnd("abc?", "?")).equal("abc");
        must(trimEnd("a? b?c???", "?")).equal("a? b?c");
    });

    it("should trim multiple characters as a whole", async () => {
        must(trimEnd("abc", "bc")).equal("a");

        must(trimEnd("abcc", "bc")).equal("abcc");
        must(trimEnd("abcb", "bc")).equal("abcb");
    });

    it("can trim into empty string", async () => {
        must(trimEnd("abc", "abc")).equal("");
        must(trimEnd("a", "a")).equal("");
    });
});

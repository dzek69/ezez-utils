import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { trim } from "./trim";

describe("trim", () => {
    it("should trim single character from both sides of the string", async () => {
        must(trim("aaacataaa", "a")).equal("cat");
        must(trim("abacteria", "a")).equal("bacteri");
        must(trim("abc", "a")).equal("bc");
        must(trim("abc", "c")).equal("ab");
        must(trim("aajjja", "a")).equal("jjj");
    });

    it("should trim multiple characters as a whole", async () => {
        must(trim("abopopab", "ab")).equal("opop");
        must(trim("atitleb", "ab")).equal("atitleb");
        must(trim("abtitleab", "ab")).equal("title");
    });

    it("can trim into empty string", async () => {
        must(trim("abc", "abc")).equal("");
        must(trim("a", "a")).equal("");
    });
});

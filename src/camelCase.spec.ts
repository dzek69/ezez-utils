import must from "must";

import { camelCase } from "./camelCase";

describe("camelCase", () => {
    it("converts snake case into camel case", async () => {
        must(camelCase("snake_case")).equal("snakeCase");
    });

    it("converts snake case multiple underscores into camel case", async () => {
        const ts = camelCase("_snake__case_");
        must(camelCase("_snake__case_")).equal("snakeCase");
    });

    it("converts just the underscore to nothing", async () => {
        must(camelCase("_")).equal("");
        must(camelCase("__")).equal("");
    });

    it("converts polish letters snake case into camel case", async () => {
        must(camelCase("Śnieżna_łódka")).equal("śnieżnaŁódka");
    });

    it("converts kebab case into camel case", async () => {
        must(camelCase("kebab-case")).equal("kebabCase");
    });

    it("converts kebab case multiple dashes into camel case", async () => {
        must(camelCase("-kebab--case-")).equal("kebabCase");
    });

    it("converts just the dash to nothing", async () => {
        must(camelCase("-")).equal("");
        must(camelCase("--")).equal("");
    });

    it("converts polish letters kebab case into camel case", async () => {
        must(camelCase("Śnieżna-łódka")).equal("śnieżnaŁódka");
    });

    it("converts PascalCase to camelCase", async () => {
        const ts = camelCase("PascalCase");
        must(camelCase("PascalCase")).equal("pascalCase");
    });

    it("keeps uppercase later in the PascalCase", async () => {
        const ts = camelCase("PascalCaseXD");
        must(camelCase("PascalCaseXD")).equal("pascalCaseXD");
    });
});

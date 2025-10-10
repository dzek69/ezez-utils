import { getEslintConfig } from "@ezez/eslint";
import { readFile } from "fs/promises";

const packageJson = JSON.parse(String(await readFile("./package.json")));
const react = Boolean(packageJson.libraryTemplate?.jsx);

const config = getEslintConfig({ react });
config.push({
    languageOptions: {
        globals: {
            must: true,
        },
    },
});

config.push({
    files: ["**/*.spec.*"],
    rules: {
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
    },
});
config.push({
    files: ["**/*"],
    rules: {
        "@typescript-eslint/no-unsafe-type-assertion": "off",
    },
});

export default config;

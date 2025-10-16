import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { hasProps } from "./hasProps";

describe("hasProps", () => {
    it("should return true for object with valid string properties", () => {
        const obj = { id: "123", name: "John" };
        const result = hasProps(obj, { id: "string", name: "string" });
        must(result).be.true();
    });

    it("should return true for object with valid number properties", () => {
        const obj = { age: 25, count: 100 };
        const result = hasProps(obj, { age: "number", count: "number" });
        must(result).be.true();
    });

    it("should return true for object with valid boolean properties", () => {
        const obj = { isActive: true, isDeleted: false };
        const result = hasProps(obj, { isActive: "boolean", isDeleted: "boolean" });
        must(result).be.true();
    });

    it("should return true for object with mixed property types", () => {
        const obj = { id: "123", age: 30, isActive: true };
        const result = hasProps(obj, { id: "string", age: "number", isActive: "boolean" });
        must(result).be.true();
    });

    it("should return false for object with wrong property type", () => {
        const obj = { id: 123, name: "John" };
        const result = hasProps(obj, { id: "string", name: "string" });
        must(result).be.false();
    });

    it("should return false for object missing required property", () => {
        const obj = { id: "123" };
        const result = hasProps(obj, { id: "string", name: "string" });
        must(result).be.false();
    });

    it("should return false for null", () => {
        const result = hasProps(null, { id: "string" });
        must(result).be.false();
    });

    it("should return false for undefined", () => {
        const result = hasProps(undefined, { id: "string" });
        must(result).be.false();
    });

    it("should return false for array", () => {
        const arr = [{ id: "123" }];
        const result = hasProps(arr, { id: "string" });
        must(result).be.false();
    });

    it("should return false for primitive string", () => {
        const result = hasProps("test", { id: "string" });
        must(result).be.false();
    });

    it("should return false for primitive number", () => {
        const result = hasProps(123, { id: "string" });
        must(result).be.false();
    });

    it("should return false for primitive boolean", () => {
        const result = hasProps(true, { id: "string" });
        must(result).be.false();
    });

    it("should return true for empty schema", () => {
        const obj = { id: "123", name: "John" };
        const result = hasProps(obj, {});
        must(result).be.true();
    });

    it("should allow extra properties on the object", () => {
        const obj = { id: "123", name: "John", extra: "value" };
        const result = hasProps(obj, { id: "string", name: "string" });
        must(result).be.true();
    });

    it("should handle objects with null property values", () => {
        const obj = { id: null, name: "John" };
        const result = hasProps(obj, { id: "string", name: "string" });
        must(result).be.false();
    });

    it("should handle objects with undefined property values", () => {
        const obj = { id: undefined, name: "John" };
        const result = hasProps(obj, { id: "string", name: "string" });
        must(result).be.false();
    });

    it("should correctly validate boolean false value", () => {
        const obj = { isActive: false };
        const result = hasProps(obj, { isActive: "boolean" });
        must(result).be.true();
    });

    it("should correctly validate number zero value", () => {
        const obj = { count: 0 };
        const result = hasProps(obj, { count: "number" });
        must(result).be.true();
    });

    it("should correctly validate empty string value", () => {
        const obj = { name: "" };
        const result = hasProps(obj, { name: "string" });
        must(result).be.true();
    });

    it("should work with objects source only", async () => {
        const source = () => null;
        must(source).have.property("name", "source");

        const result = hasProps(source, { name: "string" });
        must(result).be.false();
    });
});

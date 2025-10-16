import must from "must"; // eslint-disable-line @typescript-eslint/no-shadow

import { assertProps } from "./assertProps";

describe("assertProps", () => {
    it("should not throw for object with valid string properties", () => {
        const obj = { id: "123", name: "John" };
        must(() => { assertProps(obj, { id: "string", name: "string" }); }).not.throw();
    });

    it("should not throw for object with valid number properties", () => {
        const obj = { age: 25, count: 100 };
        must(() => { assertProps(obj, { age: "number", count: "number" }); }).not.throw();
    });

    it("should not throw for object with valid boolean properties", () => {
        const obj = { isActive: true, isDeleted: false };
        must(() => {
            assertProps(obj, { isActive: "boolean", isDeleted: "boolean" });
        }).not.throw();
    });

    it("should not throw for object with mixed property types", () => {
        const obj = { id: "123", age: 30, isActive: true };
        must(() => {
            assertProps(obj, { id: "string", age: "number", isActive: "boolean" });
        }).not.throw();
    });

    it("should throw for object with wrong property type", () => {
        const obj = { id: 123, name: "John" };
        must(() => {
            assertProps(obj, { id: "string", name: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for object missing required property", () => {
        const obj = { id: "123" };
        must(() => {
            assertProps(obj, { id: "string", name: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for null", () => {
        must(() => {
            assertProps(null, { id: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for undefined", () => {
        must(() => {
            assertProps(undefined, { id: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for array", () => {
        const arr = [{ id: "123" }];
        must(() => {
            assertProps(arr, { id: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for primitive string", () => {
        must(() => {
            assertProps("test", { id: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for primitive number", () => {
        must(() => {
            assertProps(123, { id: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for primitive boolean", () => {
        must(() => {
            assertProps(true, { id: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should not throw for empty schema", () => {
        const obj = { id: "123", name: "John" };
        must(() => { assertProps(obj, {}); }).not.throw();
    });

    it("should allow extra properties on the object", () => {
        const obj = { id: "123", name: "John", extra: "value" };
        must(() => { assertProps(obj, { id: "string", name: "string" }); }).not.throw();
    });

    it("should throw for objects with null property values", () => {
        const obj = { id: null, name: "John" };
        must(() => {
            assertProps(obj, { id: "string", name: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should throw for objects with undefined property values", () => {
        const obj = { id: undefined, name: "John" };
        must(() => {
            assertProps(obj, { id: "string", name: "string" });
        }).throw("Object does not match the required schema");
    });

    it("should correctly validate boolean false value", () => {
        const obj = { isActive: false };
        must(() => { assertProps(obj, { isActive: "boolean" }); }).not.throw();
    });

    it("should correctly validate number zero value", () => {
        const obj = { count: 0 };
        must(() => { assertProps(obj, { count: "number" }); }).not.throw();
    });

    it("should correctly validate empty string value", () => {
        const obj = { name: "" };
        must(() => { assertProps(obj, { name: "string" }); }).not.throw();
    });

    it("should work with objects source only", async () => {
        const source = () => null;
        must(source).have.property("name", "source");

        must(() => {
            assertProps(source, { name: "string" });
        }).throw("Object does not match the required schema");
    });
});

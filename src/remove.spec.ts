import { remove as _remove } from "lodash";

// @ts-expect-error Complaining about root dir
import createSpy from "../test/createSpy.js";
import { remove } from "./remove.js";

describe("remove", () => {
    it("removes values", () => {
        const fn = x => x % 2 === 0;

        const src = [1, 2, 3, 4, 5, 6, 7];
        const _src = [...src];

        remove(src, fn);
        src.must.eql([1, 3, 5, 7]);

        _remove(_src, fn);
        _src.must.eql([1, 3, 5, 7]);
    });

    it("returns removed values", () => {
        const fn = x => x % 2 === 0;

        const src = [1, 2, 3, 4, 5, 6, 7];
        const _src = [...src];

        const removed = remove(src, fn);
        removed.must.eql([2, 4, 6]);

        const _removed = _remove(_src, fn);
        _removed.must.eql([2, 4, 6]);
    });

    it("calls test function with correct arguments", () => {
        const fn = x => x % 2 === 0;
        const spy = createSpy(fn);
        const _spy = createSpy(fn);

        const src = [1, 2, 3, 4, 5, 6, 7];
        const _src = [...src];
        const srcCopy = [...src];

        remove(src, spy);
        spy.__spy.calls.must.have.length(7);
        spy.__spy.calls[0].must.eql([1, 0, srcCopy]);
        spy.__spy.calls[1].must.eql([2, 1, srcCopy]);
        spy.__spy.calls[2].must.eql([3, 2, srcCopy]);
        spy.__spy.calls[3].must.eql([4, 3, srcCopy]);
        spy.__spy.calls[4].must.eql([5, 4, srcCopy]);
        spy.__spy.calls[5].must.eql([6, 5, srcCopy]);
        spy.__spy.calls[6].must.eql([7, 6, srcCopy]);

        remove(_src, _spy);
        _spy.__spy.calls.must.have.length(7);
        _spy.__spy.calls[0].must.eql([1, 0, srcCopy]);
        _spy.__spy.calls[1].must.eql([2, 1, srcCopy]);
        _spy.__spy.calls[2].must.eql([3, 2, srcCopy]);
        _spy.__spy.calls[3].must.eql([4, 3, srcCopy]);
        _spy.__spy.calls[4].must.eql([5, 4, srcCopy]);
        _spy.__spy.calls[5].must.eql([6, 5, srcCopy]);
        _spy.__spy.calls[6].must.eql([7, 6, srcCopy]);
    });
});

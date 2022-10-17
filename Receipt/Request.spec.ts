// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Blob } from "blob-polyfill"
import * as model from "../index"
globalThis.Blob = Blob

describe("Receipt.Request", () => {
	const request: model.Receipt.Request = {
		amount: [10, "EUR"],
		vat: 0.25,
		file: new Blob(),
	}
	it("is", () => {
		expect(model.Receipt.Request.is(request)).toEqual(true)
	})
})

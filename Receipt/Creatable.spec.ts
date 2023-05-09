import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import * as model from "../index"
globalThis.Blob = Blob
globalThis.FormData = FormData
globalThis.File = File

describe("Receipt.Creatable", () => {
	it("is", () => {
		const receipt: model.Receipt.Creatable = {
			total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }],
			file: new File([new Uint8Array([97])], "file"),
		}
		expect(model.Receipt.Creatable.is(receipt)).toEqual(true)
	})
	it("validate", () => {
		const creatable: model.Receipt.Creatable = {
			file: new File([new Uint8Array([97])], "file"),
			total: [{ net: [1, "EUR"], vat: [1, "EUR"] }],
		}
		expect(model.Receipt.Creatable.validate(creatable, "EUR")).toEqual(true)
		expect(model.Receipt.Creatable.validate(creatable, "USD")).toEqual(false)
		expect(model.Receipt.Creatable.validate({ ...creatable, total: [] }, "EUR")).toEqual(false)
	})
})

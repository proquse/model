import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import { issuefab } from "../index"
globalThis.Blob = Blob
globalThis.FormData = FormData
globalThis.File = File

describe("Receipt.Creatable", () => {
	it("is", () => {
		const receiptImg: issuefab.Receipt.Creatable = {
			total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }],
			file: new File([new Uint8Array([97])], "file", { type: "image/jpeg" }),
		}
		const receipt: issuefab.Receipt.Creatable = {
			total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }],
			file: new File([new Uint8Array([97])], "file"),
		}

		expect(issuefab.Receipt.Creatable.is(receiptImg)).toEqual(true)
		expect(issuefab.Receipt.Creatable.is((({ total, ...receipt }) => receipt)(receipt))).toEqual(false)
		expect(issuefab.Receipt.Creatable.is((({ file, ...receipt }) => receipt)(receipt))).toEqual(false)
	})
	it("validate", () => {
		const creatable: issuefab.Receipt.Creatable = {
			file: new File([new Uint8Array([97])], "file"),
			total: [{ net: [1, "EUR"], vat: [1, "EUR"] }],
		}
		expect(issuefab.Receipt.Creatable.validate(creatable, "EUR")).toEqual(true)
		expect(issuefab.Receipt.Creatable.validate(creatable, "USD")).toEqual(false)
		expect(issuefab.Receipt.Creatable.validate({ ...creatable, total: [] }, "EUR")).toEqual(false)
	})
})

import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import { proquse } from "../index"
Object.assign(globalThis, { Blob, File, FormData })

describe("Receipt.Creatable", () => {
	it("is", () => {
		const receiptImg: proquse.Receipt.Creatable = {
			total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
			file: new File([new Uint8Array([97])], "file", { type: "image/jpeg" }),
			date: "2023-01-01T00:00:42Z",
		}
		const receipt: proquse.Receipt.Creatable = {
			total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
			file: new File([new Uint8Array([97])], "file"),
			date: "2023-01-01T00:00:42Z",
		}

		expect(proquse.Receipt.Creatable.is(receiptImg)).toEqual(true)
		expect(proquse.Receipt.Creatable.is((({ total, ...receipt }) => receipt)(receipt))).toEqual(false)
		expect(proquse.Receipt.Creatable.is((({ file, ...receipt }) => receipt)(receipt))).toEqual(false)
	})
	it("validate", () => {
		const creatable: proquse.Receipt.Creatable = {
			file: new File([new Uint8Array([97])], "file"),
			total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
			date: "2023-01-01T00:00:42Z",
		}
		expect(proquse.Receipt.Creatable.validate(creatable, "EUR")).toEqual({ status: true })
		expect(proquse.Receipt.Creatable.validate(creatable, "USD")).toEqual({ status: true })
		expect(proquse.Receipt.Creatable.validate({ ...creatable, total: [] }, "EUR")).toEqual({
			status: false,
			reason: "amount",
			origin: { ...creatable, total: [] },
		})
	})
})

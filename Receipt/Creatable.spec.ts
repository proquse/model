import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob } from "web-file-polyfill"
import * as model from "../index"
globalThis.Blob = Blob
globalThis.FormData = FormData

describe("Receipt.Creatable", () => {
	it("is", () => {
		const receipt: model.Receipt.Creatable = {
			total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }],
			file: new Uint8Array([97]),
		}
		expect(model.Receipt.Creatable.is(receipt)).toEqual(true)
	})
	it("formData", () => {
		const form = model.Receipt.Creatable.formData({
			total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }],
			file: new Uint8Array([97]),
		})
		const jsonString = form.get("data") as string
		expect(typeof jsonString).toEqual("string")
		const json = JSON.parse(jsonString)
		expect(json.total).toBeTruthy()
		expect(Array.isArray(json.total)).toEqual(true)
		expect(json.total.every((total: unknown) => model.Receipt.Total.is(total)))
		const file = form.get("file") as File
		expect(file.constructor.name).toEqual("File")
		expect(file.size).toEqual(1)
		expect(file.type).toEqual("")
		expect(typeof file.lastModified).toEqual("number")
	})
	it("parse", () => {
		let form: any = {
			data: JSON.stringify({ total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }] }),
			file: { data: new Uint8Array([97]) },
		}
		expect(model.Receipt.Creatable.parse(form)).toEqual({
			total: [{ net: [10, "EUR"], vat: [2.5, "EUR"] }],
			file: new Uint8Array([97]),
		})
		form = {
			amount: [1, "EUR"],
			vat: 1,
			file: form.file,
		}
		expect(model.Receipt.Creatable.parse(form)).toEqual(undefined)
		form = {
			data: JSON.stringify([]),
			file: form.file,
		}
		expect(model.Receipt.Creatable.parse(form)).toEqual(undefined)
		expect(model.Receipt.Creatable.parse({ data: '"{\\"total\\":[]}" ', file: form.file }))
	})
})

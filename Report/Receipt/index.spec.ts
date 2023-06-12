import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import { issuefab } from "../../index"
globalThis.Blob = Blob
globalThis.FormData = FormData
globalThis.File = File

describe("ReportReceipt", () => {
	const file = { file: new File([new Uint8Array([97])], "file") }
	const notAFile = "file"

	it("is", () => {
		expect(issuefab.Report.Expense.type.is(file)).toEqual(true)
		expect(issuefab.Report.Expense.type.is(notAFile)).toEqual(false)
	})
})

import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import { proquse } from "../../index"

Object.assign(globalThis, { Blob, FormData, File })

describe("ReportReceipt", () => {
	const file = { file: new File([new Uint8Array([97])], "file") }
	const notAFile = "file"

	it("is", () => {
		expect(proquse.Report.Expense.type.is(file)).toEqual(true)
		expect(proquse.Report.Expense.type.is(notAFile)).toEqual(false)
	})
})

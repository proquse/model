import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import { proquse } from "../index"
globalThis.Blob = Blob
globalThis.FormData = FormData
globalThis.File = File

describe("Report", () => {
	const file = { file: new File([new Uint8Array([97])], "file") }
	const notAFile = "file"

	it("is", () => {
		expect(proquse.Report.is(file)).toEqual(true)
		expect(proquse.Report.is(notAFile)).toEqual(false)
	})
})

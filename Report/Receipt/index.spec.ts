import * as fs from "fs/promises"
import { Blob, File } from "web-file-polyfill"
import { issuefab } from "../../index"
globalThis.Blob = Blob
globalThis.File = File

describe("Receipt", () => {
	it("compile", async () => {
		const receiptA = new File([await createBufferFromFile("./Report/testFiles/receiptA.pdf")], "ReceiptA.pdf", {
			type: "application/pdf",
		})
		const receipt: issuefab.Receipt = {
			id: "asd",
			original: "https://example.com/receipt.pdf",
			total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
			date: "2022-01-01T00:00:42Z",
		}
		const purchase: issuefab.Purchase = {
			id: "aoeu1234",
			created: "2022-01-01T00:00:42Z",
			modified: "2022-01-01T00:00:42Z",
			buyer: "richard.stevensson@example.com",
			amount: [951221, "EUR"],
			purpose: "Production Workers",
			email: "receipt@example.com",
			payment: { type: "card", limit: [10, "EUR"] },
			receipts: [receipt],
			transactions: [],
		}

		const creatableReceipt: issuefab.Report.Receipt.Creatable = {
			receiptData: [{ costCenter: "test1", receipts: [{ details: receipt, file: receiptA, purchase }] }],
			organization: "Test Org",
			dateRange: {
				start: "2022-09-19",
				end: "2022-09-21",
			},
		}

		const receiptReport = { file: await issuefab.Report.Receipt.compile(creatableReceipt) }
		if (receiptReport)
			await fs.writeFile("./Report/testFiles/receiptReport.pdf", receiptReport.file)
		expect(issuefab.Report.Receipt.type.is(receiptReport)).toEqual(true)
		expect(issuefab.Report.Receipt.type.is((({ file, ...receiptReport }) => receiptReport)(receiptReport))).toEqual(
			false
		)
	})
})

async function createBufferFromFile(filePath: string): Promise<Buffer> {
	return await fs.readFile(filePath)
}

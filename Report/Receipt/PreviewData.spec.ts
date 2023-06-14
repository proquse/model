import { FormData } from "formdata-polyfill/esm.min.js"
import { Blob, File } from "web-file-polyfill"
import { issuefab } from "../../index"
import { PreviewData } from "./PreviewData"
globalThis.Blob = Blob
globalThis.FormData = FormData
globalThis.File = File
describe("receipt PreviewData", () => {
	const dummyPreviewData: PreviewData = {
		receiptsData: [
			{
				costCenter: "Example Cost Center",
				receipts: [
					{
						details: {
							id: "receiptId",
							original: "https://example.com/receipt.pdf",
							total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
							date: "2022-01-01T00:00:42Z",
							transactionId: "transactionId",
						},
						purchase: {
							id: "aoeu1234",
							created: "2022-01-01T00:00:42Z",
							modified: "2022-01-01T00:00:42Z",
							buyer: "richard.stevensson@example.com",
							amount: [951221, "EUR"],
							purpose: "Production Workers",
							email: "receipt@example.com",
							payment: { type: "card", limit: [10, "EUR"] },
							receipts: [
								{
									id: "id",
									total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
									date: "2022-01-01T00:00:42Z",
									original: "https://example.com/receipt.pdf",
								},
							],
							transactions: [],
						},
						file: new File([new Uint8Array([97])], "file"),
					},
				],
			},
		],
		organization: "Example Organization",
		dateRange: {
			start: "2022-01-01",
			end: "2022-01-31",
		},
	}

	it("is", () => {
		expect(issuefab.Report.Receipt.PreviewData.is(dummyPreviewData)).toEqual(true)
		expect(
			issuefab.Report.Receipt.PreviewData.is(
				(({ organization, ...dummyPreviewData }) => dummyPreviewData)(dummyPreviewData)
			)
		).toEqual(false)
	})
})

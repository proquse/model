import { issuefab } from "../../index"
describe("Expense PreviewData", () => {
	const purchase: issuefab.Purchase = {
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
	}
	const previewData: issuefab.Report.Expense.PreviewData = {
		compileData: {
			category1: [purchase, purchase],
			category2: [purchase],
		},
		organization: "ABC Company",
		dateRange: {
			start: "2023-06-01",
			end: "2023-06-03",
		},
	}

	it("is", () => {
		expect(issuefab.Report.Expense.PreviewData.is(previewData)).toEqual(true)
		expect(
			issuefab.Report.Expense.PreviewData.is((({ organization, ...previewData }) => previewData)(previewData))
		).toEqual(false)
		expect(issuefab.Report.Expense.PreviewData.type.get({ ...previewData, test: "dummy text" })).toEqual(previewData)
		expect(
			issuefab.Report.Expense.PreviewData.is((({ dateRange, ...previewData }) => previewData)(previewData))
		).toEqual(false)
		expect(
			issuefab.Report.Expense.PreviewData.is((({ compileData, ...previewData }) => previewData)(previewData))
		).toEqual(false)
	})
})

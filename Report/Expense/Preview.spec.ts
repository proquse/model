import { issuefab } from "../../index"
describe("Expense Preview", () => {
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
	const preview: issuefab.Report.Expense.Preview = {
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
		expect(issuefab.Report.Expense.Preview.is(preview)).toEqual(true)
		expect(issuefab.Report.Expense.Preview.is((({ organization, ...preview }) => preview)(preview))).toEqual(false)
		expect(issuefab.Report.Expense.Preview.type.get({ ...preview, test: "dummy text" })).toEqual(preview)
		expect(issuefab.Report.Expense.Preview.is((({ dateRange, ...preview }) => preview)(preview))).toEqual(false)
		expect(issuefab.Report.Expense.Preview.is((({ compileData, ...preview }) => preview)(preview))).toEqual(false)
	})
})

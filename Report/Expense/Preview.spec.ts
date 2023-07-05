import { issuefab } from "../../index"

describe("Expense Preview", () => {
	const purchase: issuefab.Purchase = {
		id: "---p----",
		created: "2022-01-01T00:00:42Z",
		modified: "2022-01-01T00:00:42Z",
		buyer: "richard.stevensson@example.com",
		purpose: "Production Workers",
		email: "receipt@example.com",
		payment: { type: "card", limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" } },
		receipts: [
			{
				id: "---id---",
				total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
				date: "2022-01-01T00:00:42Z",
				original: "https://example.com/receipt.pdf",
			},
		],
	}
	const preview: issuefab.Report.Expense.Preview = {
		userExpenses: {
			"jessie@rocket.com": [purchase, purchase],
			"james@rocket.com": [purchase],
		},
		organization: "---o----",
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
		expect(issuefab.Report.Expense.Preview.is((({ userExpenses, ...preview }) => preview)(preview))).toEqual(false)
	})
})

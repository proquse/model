import { issuefab } from "../../index"

describe("Payment.Expense", () => {
	const payment: issuefab.Payment.Expense = {
		type: "expense",
		limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		paid: {},
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.is(payment)).toEqual(true)
		expect(issuefab.Payment.Expense.is({ ...payment, type: "invoice" })).toEqual(false)
	})
})

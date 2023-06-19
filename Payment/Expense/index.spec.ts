import { issuefab } from "../../index"

describe("Payment.Expense", () => {
	const expense: issuefab.Payment.Expense = {
		type: "expense",
		limit: [10, "EUR"],
		paid: {},
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.is(expense)).toEqual(true)
		expect(issuefab.Payment.Expense.is({ type: "invoice", limit: [10, "EUR"] })).toEqual(false)
	})
})

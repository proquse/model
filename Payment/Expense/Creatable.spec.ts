import { issuefab } from "../../index"

describe("Payment.Expense", () => {
	const payment: issuefab.Payment.Creatable.Expense = {
		type: "expense",
		limit: { interval: "month", value: 20, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(issuefab.Payment.Creatable.Expense.is(payment)).toEqual(true)
		expect(issuefab.Payment.Creatable.is(payment)).toEqual(true)
		expect(issuefab.Payment.Creatable.Expense.is(null)).toBeFalsy()
		expect(issuefab.Payment.Creatable.Expense.is((({ limit, ...payment }) => payment)(payment))).toEqual(false)
		expect(issuefab.Payment.Creatable.Expense.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})
})

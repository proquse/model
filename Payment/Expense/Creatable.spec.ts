import { proquse } from "../../index"

describe("Payment.Expense", () => {
	const payment: proquse.Payment.Creatable.Expense = {
		type: "expense",
		limit: { interval: "month", value: 20, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(proquse.Payment.Creatable.Expense.is(payment)).toEqual(true)
		expect(proquse.Payment.Creatable.is(payment)).toEqual(true)
		expect(proquse.Payment.Creatable.Expense.is(null)).toBeFalsy()
		expect(proquse.Payment.Creatable.Expense.is((({ limit, ...payment }) => payment)(payment))).toEqual(false)
		expect(proquse.Payment.Creatable.Expense.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})
})

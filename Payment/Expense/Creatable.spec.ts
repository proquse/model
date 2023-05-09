import { issuefab } from "../../index"
describe("Payment.Expense", () => {
	const payment: issuefab.Payment.Creatable.Expense = {
		type: "expense",
		limit: [20, "EUR"],
	}
	it("is", () => {
		expect(issuefab.Payment.Creatable.Expense.is(payment)).toEqual(true)
		expect(issuefab.Payment.Creatable.is(payment)).toEqual(true)
		expect(issuefab.Payment.Creatable.Expense.is(null)).toBeFalsy()
		expect(issuefab.Payment.Creatable.Expense.is((({ limit, ...payment }) => payment)(payment))).toEqual(false)
		expect(issuefab.Payment.Creatable.Expense.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})
	it("validate", () => {
		expect(issuefab.Payment.Creatable.Expense.validate(payment, [30, "EUR"])).toEqual(true)
		expect(issuefab.Payment.Creatable.validate(payment, [30, "EUR"])).toEqual(true)
		expect(issuefab.Payment.Creatable.Expense.validate(payment, [15, "EUR"])).toEqual(false)
		expect(issuefab.Payment.Creatable.validate(payment, [15, "EUR"])).toEqual(false)
	})
})

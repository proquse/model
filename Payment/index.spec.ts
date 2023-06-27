import { issuefab } from "../index"

describe("Payment", () => {
	const payment: issuefab.Payment = {
		type: "card",
		limit: [10, "EUR"],
	}
	const expense: issuefab.Payment.Expense = {
		type: "expense",
		limit: [10, "EUR"],
		paid: { abcd0001: { issuer: "tobe@kakal.cse", created: "2021-12-20T13:37:42Z", modified: "2021-12-20T13:37:42Z" } },
	}
	it("is", () => {
		expect(issuefab.Payment.is(payment)).toEqual(true)
		expect(issuefab.Payment.is({ ...expense, type: "pre-paid" })).toEqual(true)
		expect(issuefab.Payment.is(expense)).toEqual(true)
		expect(issuefab.Payment.is((({ paid, ...expense }) => expense)(expense))).toEqual(true)
		expect(issuefab.Payment.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(issuefab.Payment.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})

	it("validate", () => {
		expect(issuefab.Payment.validate(payment)).toEqual(true)
		expect(issuefab.Payment.validate(payment, [10, "EUR"])).toEqual(true)
		expect(issuefab.Payment.validate(payment, [9, "EUR"])).toEqual(false)
		expect(issuefab.Payment.validate({ type: "card", limit: [-1, "EUR"] })).toEqual(false)
	})
})

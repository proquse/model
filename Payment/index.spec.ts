import { issuefab } from "../index"

describe("Payment", () => {
	const payment: issuefab.Payment = {
		type: "card",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	const expense: issuefab.Payment.Expense = {
		type: "expense",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		reimbursement: {
			abcd0001: { issuer: "tobe@kakal.cse", created: "2021-12-20T13:37:42Z", modified: "2021-12-20T13:37:42Z" },
		},
	}
	it("is", () => {
		expect(issuefab.Payment.is(payment)).toEqual(true)
		expect(issuefab.Payment.is({ ...expense, type: "pre-paid" })).toEqual(true)
		expect(issuefab.Payment.is(expense)).toEqual(true)
		expect(issuefab.Payment.is((({ reimbursement, ...expense }) => expense)(expense))).toEqual(true)
		expect(issuefab.Payment.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(issuefab.Payment.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})
})

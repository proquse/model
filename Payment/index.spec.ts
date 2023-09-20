import { proquse } from "../index"

describe("Payment", () => {
	const payment: proquse.Payment = {
		type: "card",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	const expense: proquse.Payment.Expense = {
		type: "expense",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		reimbursement: {
			abcd0001: { issuer: "tobe@kakal.cse", created: "2021-12-20T13:37:42Z", modified: "2021-12-20T13:37:42Z" },
		},
	}
	it("is", () => {
		expect(proquse.Payment.is(payment)).toEqual(true)
		expect(proquse.Payment.is({ ...expense, type: "pre-paid" })).toEqual(true)
		expect(proquse.Payment.is(expense)).toEqual(true)
		expect(proquse.Payment.is((({ reimbursement, ...expense }) => expense)(expense))).toEqual(true)
		expect(proquse.Payment.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(proquse.Payment.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})
})

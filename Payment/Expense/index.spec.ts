import { proquse } from "../../index"

describe("Payment.Expense", () => {
	const payment: proquse.Payment.Expense = {
		type: "expense",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		reimbursement: {
			abcd0001: { issuer: "tobe@kakal.cse", created: "2021-12-20T13:37:42Z", modified: "2021-12-20T13:37:42Z" },
		},
	}
	it("is", () => {
		expect(proquse.Payment.Expense.is(payment)).toEqual(true)
		expect(proquse.Payment.Expense.is((({ reimbursement, ...expense }) => expense)(payment))).toEqual(true)
		expect(proquse.Payment.Expense.is((({ type, ...expense }) => expense)(payment))).toEqual(false)
		expect(proquse.Payment.Expense.is({ type: "invoice", limit: [10, "EUR"] })).toEqual(false)
	})
})

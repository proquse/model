import { issuefab } from "../../index"

describe("Payment.Expense", () => {
	const expense: issuefab.Payment.Expense = {
		type: "expense",
		limit: [10, "EUR"],
		reimbursement: {
			abcd0001: { issuer: "tobe@kakal.cse", created: "2021-12-20T13:37:42Z", modified: "2021-12-20T13:37:42Z" },
		},
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.is(expense)).toEqual(true)
		expect(issuefab.Payment.Expense.is((({ reimbursement, ...expense }) => expense)(expense))).toEqual(true)
		expect(issuefab.Payment.Expense.is((({ type, ...expense }) => expense)(expense))).toEqual(false)
		expect(issuefab.Payment.Expense.is({ type: "invoice", limit: [10, "EUR"] })).toEqual(false)
	})
})

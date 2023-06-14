import { isoly } from "isoly"
import { issuefab } from "../../../index"

describe("Payment expense Paid", () => {
	const paid: issuefab.Payment.Expense.Paid = {
		created: isoly.Date.now(),
		issuer: "test@test.com",
		modified: isoly.Date.now(),
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.Paid.is(paid)).toEqual(true)
		expect(issuefab.Payment.Expense.Paid.is({ created: "2023 - 01 - 12", issuer: "Hello@hej.com" })).toEqual(false)
		expect(issuefab.Payment.Expense.Paid.is((({ created, ...paid }) => paid)(paid))).toEqual(false)
	})
})

import { isoly } from "isoly"
import { issuefab } from "../../index"

describe("Payment.Expense", () => {
	const paid: issuefab.Payment.Expense.Paid = {
		created: isoly.Date.now(),
		issuer: "test@test.com",
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.Paid.is(paid)).toEqual(true)
		expect(issuefab.Payment.Expense.Paid.is({ created: "2023 - 01 - 12", issuer: "Hello@hej.com" })).toEqual(false)
	})
})

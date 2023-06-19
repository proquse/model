import { isoly } from "isoly"
import { issuefab } from "../../../index"

describe("Payment expense Paid", () => {
	const paid: issuefab.Payment.Expense.Paid = {
		created: isoly.DateTime.now(),
		issuer: "test@test.com",
		modified: isoly.DateTime.now(),
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.Paid.is(paid)).toEqual(true)
		expect(
			issuefab.Payment.Expense.Paid.is({
				created: "2023-06-19T11:08:11.247Z",
				modified: "2023-06-19T11:08:11.247Z",
				issuer: "Hello@hej.com",
			})
		).toEqual(false)
		expect(issuefab.Payment.Expense.Paid.is((({ created, ...paid }) => paid)(paid))).toEqual(false)
	})
})

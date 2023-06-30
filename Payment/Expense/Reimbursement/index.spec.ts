import { isoly } from "isoly"
import { issuefab } from "../../../index"

describe("Payment expense Reimbursement", () => {
	const reimbursement: issuefab.Payment.Expense.Reimbursement = {
		created: isoly.DateTime.now(),
		issuer: "test@test.com",
		modified: isoly.DateTime.now(),
	}
	it("is", () => {
		expect(issuefab.Payment.Expense.Reimbursement.is(reimbursement)).toEqual(true)
		expect(
			issuefab.Payment.Expense.Reimbursement.is({
				created: "2023-06-19T11:08:11.247Z",
				modified: "2023-06-19T11:08:11.247Z",
				issuer: "Hello@hej.com",
			})
		).toEqual(true)

		expect(
			issuefab.Payment.Expense.Reimbursement.is((({ created, ...reimbursement }) => reimbursement)(reimbursement))
		).toEqual(false)
	})
})

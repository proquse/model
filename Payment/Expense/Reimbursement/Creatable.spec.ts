import { issuefab } from "../../../index"

describe("Payment expense Reimbursement creatable", () => {
	const reimbursement: issuefab.Payment.Expense.Reimbursement.Creatable = {
		issuer: "asd@asd.sd",
	}

	it("is", () => {
		expect(issuefab.Payment.Expense.Reimbursement.Creatable.is(reimbursement)).toEqual(true)
		expect(issuefab.Payment.Expense.Reimbursement.Creatable.is({ ...reimbursement, created: "asdf" })).toEqual(true)
		expect(issuefab.Payment.Expense.Reimbursement.Creatable.is({ ...reimbursement, issuer: 123 })).toEqual(false)
	})
})

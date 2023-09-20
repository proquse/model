import { proquse } from "../../../index"

describe("Payment expense Reimbursement creatable", () => {
	const reimbursement: proquse.Payment.Expense.Reimbursement.Creatable = {
		issuer: "asd@asd.sd",
	}

	it("is", () => {
		expect(proquse.Payment.Expense.Reimbursement.Creatable.is(reimbursement)).toEqual(true)
		expect(proquse.Payment.Expense.Reimbursement.Creatable.is({ ...reimbursement, created: "asdf" })).toEqual(true)
		expect(proquse.Payment.Expense.Reimbursement.Creatable.is({ ...reimbursement, issuer: 123 })).toEqual(false)
	})
})

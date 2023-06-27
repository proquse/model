import { issuefab } from "../../../index"

describe("Payment expense Paid creatable", () => {
	const paid: issuefab.Payment.Expense.Paid.Creatable = {
		issuer: "asd@asd.sd",
	}

	it("is", () => {
		expect(issuefab.Payment.Expense.Paid.Creatable.is(paid)).toEqual(true)
		expect(issuefab.Payment.Expense.Paid.Creatable.is({ ...paid, created: "asdf" })).toEqual(true)
		expect(issuefab.Payment.Expense.Paid.Creatable.is({ ...paid, issuer: 123 })).toEqual(false)
	})
})

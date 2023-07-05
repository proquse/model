import { issuefab } from "../index"

describe("Expense Creatable", () => {
	const expenseCreatable: issuefab.Report.Expense.Creatable = {
		emails: ["Test@test.com"],
		costCenters: ["---c1---"],
	}
	const receiptCreatable: issuefab.Report.Receipt.Creatable = {
		costCenters: ["---c2---"],
	}

	it("is", () => {
		expect(issuefab.Report.Creatable.is(expenseCreatable)).toEqual(true)
		expect(issuefab.Report.Creatable.is(receiptCreatable)).toEqual(true)
		expect(issuefab.Report.Creatable.is((({ costCenters, ...creatable }) => creatable)(expenseCreatable))).toEqual(
			false
		)
		expect(issuefab.Report.Creatable.is((({ emails, ...creatable }) => creatable)(expenseCreatable))).toEqual(true)
	})
})

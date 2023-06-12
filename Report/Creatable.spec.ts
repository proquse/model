import { issuefab } from "../index"

describe("Expense Creatable", () => {
	const expenseCreatable: issuefab.Report.Expense.Creatable = {
		emails: ["Test@test.com"],
		costCenterIds: ["asd2213"],
	}
	const receiptCreatable: issuefab.Report.Receipt.Creatable = {
		costCenterIds: ["asd2213"],
	}

	it("is", () => {
		expect(issuefab.Report.Creatable.is(expenseCreatable)).toEqual(true)
		expect(issuefab.Report.Creatable.is(receiptCreatable)).toEqual(true)
		expect(issuefab.Report.Creatable.is((({ costCenterIds, ...creatable }) => creatable)(expenseCreatable))).toEqual(
			false
		)
		expect(issuefab.Report.Creatable.is((({ emails, ...creatable }) => creatable)(expenseCreatable))).toEqual(true)
	})
})

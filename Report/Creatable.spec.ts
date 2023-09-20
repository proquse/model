import { proquse } from "../index"

describe("Expense Creatable", () => {
	const expenseCreatable: proquse.Report.Expense.Creatable = {
		emails: ["Test@test.com"],
		costCenters: ["---c1---"],
	}
	const receiptCreatable: proquse.Report.Receipt.Creatable = {
		costCenters: ["---c2---"],
	}

	it("is", () => {
		expect(proquse.Report.Creatable.is(expenseCreatable)).toEqual(true)
		expect(proquse.Report.Creatable.is(receiptCreatable)).toEqual(true)
		expect(proquse.Report.Creatable.is((({ costCenters, ...creatable }) => creatable)(expenseCreatable))).toEqual(false)
		expect(proquse.Report.Creatable.is((({ emails, ...creatable }) => creatable)(expenseCreatable))).toEqual(true)
	})
})

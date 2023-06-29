import { issuefab } from "../../index"
describe("Expense Creatable", () => {
	const creatable: issuefab.Report.Expense.Creatable = {
		emails: ["Test@test.com"],
		costCenters: ["---c1---"],
	}

	it("is", () => {
		expect(issuefab.Report.Expense.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Report.Expense.Creatable.is((({ costCenters, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
		expect(issuefab.Report.Expense.Creatable.is((({ emails, ...creatable }) => creatable)(creatable))).toEqual(true)
	})
})

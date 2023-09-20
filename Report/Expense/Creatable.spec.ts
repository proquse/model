import { proquse } from "../../index"
describe("Expense Creatable", () => {
	const creatable: proquse.Report.Expense.Creatable = {
		emails: ["Test@test.com"],
		costCenters: ["---c1---"],
	}

	it("is", () => {
		expect(proquse.Report.Expense.Creatable.is(creatable)).toEqual(true)
		expect(proquse.Report.Expense.Creatable.is((({ costCenters, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
		expect(proquse.Report.Expense.Creatable.is((({ emails, ...creatable }) => creatable)(creatable))).toEqual(true)
	})
})

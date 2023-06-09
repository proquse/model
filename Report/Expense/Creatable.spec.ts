import { issuefab } from "../../index"
describe("Expense Creatable", () => {
	const creatable: issuefab.Report.Expense.Creatable = {
		userEmails: ["Test@test.com"],
		costCenterIds: ["asd2213"],
	}

	it("is", () => {
		expect(issuefab.Report.Expense.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Report.Expense.Creatable.is((({ costCenterIds, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
		expect(issuefab.Report.Expense.Creatable.is((({ userEmails, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
	})
})

import { issuefab } from "../../index"
describe("Expense Creatable", () => {
	const creatable: issuefab.Report.Receipt.Creatable = {
		costCenters: ["---c1---"],
	}

	it("is", () => {
		expect(issuefab.Report.Receipt.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Report.Receipt.Creatable.is((({ costCenters, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
	})
})

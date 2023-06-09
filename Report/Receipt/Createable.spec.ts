import { issuefab } from "../../index"
describe("Expense Creatable", () => {
	const creatable: issuefab.Report.Receipt.Creatable = {
		costCenterIds: ["asd2213"],
	}

	it("is", () => {
		expect(issuefab.Report.Receipt.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Report.Receipt.Creatable.is((({ costCenterIds, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
	})
})

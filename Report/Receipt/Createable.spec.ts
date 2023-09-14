import { proquse } from "../../index"
describe("Expense Creatable", () => {
	const creatable: proquse.Report.Receipt.Creatable = {
		costCenters: ["---c1---"],
	}

	it("is", () => {
		expect(proquse.Report.Receipt.Creatable.is(creatable)).toEqual(true)
		expect(proquse.Report.Receipt.Creatable.is((({ costCenters, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
	})
})

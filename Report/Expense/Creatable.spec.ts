import { issuefab } from "../../index"

describe("Creatable", () => {
	const creatable: issuefab.Report.Expense.Creatable = {
		compileData: {
			data1: [
				{
					date: "2022-01-01T00:00:42Z",
					amount: [10, "USD"],
					purpose: "Production Workers",
				},
				{
					date: "2022-01-01T00:00:42Z",
					amount: [101, "USD"],
					purpose: "Production Workers2",
				},
			],
		},
		organization: "Your Organization",
		dateRange: { start: "2023-01-01", end: "2023-12-31" },
	}

	it("is", () => {
		expect(issuefab.Report.Expense.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Report.Expense.Creatable.is((({ organization, ...validData }) => validData)(creatable))).toEqual(
			false
		)
		expect(issuefab.Report.Expense.Creatable.is((({ dateRange, ...validData }) => validData)(creatable))).toEqual(false)
		expect(issuefab.Report.Expense.Creatable.is((({ compileData, ...validData }) => validData)(creatable))).toEqual(
			false
		)
	})
})

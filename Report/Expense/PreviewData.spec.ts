import { issuefab } from "../../index"
describe("Expense PreviewData", () => {
	const creatable: issuefab.Report.Expense.PreviewData = {
		compileData: {
			category1: [
				{
					purpose: "Expense 1",
					date: "2023-06-01",
					amount: [100, "SEK"],
				},
				{
					purpose: "Expense 2",
					date: "2023-06-02",
					amount: [200, "SEK"],
				},
			],
			category2: [
				{
					purpose: "Expense 3",
					date: "2023-06-03",
					amount: [300, "SEK"],
				},
			],
		},
		organization: "ABC Company",
		dateRange: {
			start: "2023-06-01",
			end: "2023-06-03",
		},
	}

	it("is", () => {
		expect(issuefab.Report.Expense.PreviewData.is(creatable)).toEqual(true)
		expect(issuefab.Report.Expense.PreviewData.is((({ organization, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
		expect(issuefab.Report.Expense.PreviewData.is((({ dateRange, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
		expect(issuefab.Report.Expense.PreviewData.is((({ compileData, ...creatable }) => creatable)(creatable))).toEqual(
			false
		)
	})
})

import * as fs from "fs/promises"
import { issuefab } from "../../index"

describe("Expense", () => {
	describe("compile", () => {
		const creatable: issuefab.Report.Expense.Creatable = {
			compileData: {
				person1: [
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
				person2: [
					{
						date: "2022-01-01T00:00:42Z",
						amount: [10, "USD"],
						purpose: "Production Workers",
					},
					{
						date: "2022-01-01T00:00:42Z",
						amount: [1021, "USD"],
						purpose: "Production Workers2",
					},
				],
			},
			organization: "Your Organization",
			dateRange: { start: "2023-01-01", end: "2023-12-31" },
		}

		it("compile", async () => {
			const expenseReport = await issuefab.Report.Expense.compile(creatable)
			if (expenseReport)
				await fs.writeFile("./Report/testFiles/expenseReport.pdf", expenseReport)
		})
	})
})

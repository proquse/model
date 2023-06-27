// import { issuefab } from "../index"
import { isoly } from "isoly"
import { Cadence } from "./index"

describe("Amount", () => {
	const year: Cadence = {
		cadence: "year",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const month: Cadence = {
		cadence: "month",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const week: Cadence = {
		cadence: "week",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const single: Cadence = {
		cadence: "single",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	it("is", () => {
		expect(Cadence.is(year)).toEqual(true)
		expect(Cadence.is(month)).toEqual(true)
		expect(Cadence.is(week)).toEqual(true)
		expect(Cadence.is(single)).toEqual(true)
		expect(Cadence.is([1, "EUR"])).toEqual(false)
	})
	it("validate", () => {
		const date = "2023-05-10"
		const past = "2023-01-01"

		const budget: Cadence = {
			cadence: "year",
			value: 1_000,
			currency: "EUR",
			created: "2023-01-01",
		}

		expect(Cadence.validate(year, past)).toEqual(false)
		expect(Cadence.validate(month, past)).toEqual(false)
		expect(Cadence.validate(week, past)).toEqual(false)
		expect(Cadence.validate(single, past)).toEqual(false)

		expect(Cadence.validate(year, date)).toEqual(true)
		expect(Cadence.validate(month, date)).toEqual(true)
		expect(Cadence.validate(week, date)).toEqual(true)
		expect(Cadence.validate(single, date)).toEqual(true)

		expect(Cadence.validate(month, date, year)).toEqual(false)
		expect(Cadence.validate(week, date, year)).toEqual(false)
		expect(Cadence.validate(single, date, year)).toEqual(true)
		expect(Cadence.validate(month, "2023-03-04", year)).toEqual(true)
		expect(Cadence.validate(week, "2023-03-04", year)).toEqual(true)
		// real use-cases
		expect(Cadence.validate(year, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Cadence.validate(month, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Cadence.validate(week, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Cadence.validate(single, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Cadence.validate({ ...year, value: 1_001 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(false)
		expect(Cadence.validate({ ...month, value: 200 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(false)
		expect(Cadence.validate({ ...week, value: 50 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(false)
	})
	it("allocated", () => {
		// past
		expect(Cadence.allocated(year, "2023-03-03")).toEqual(0)
		expect(Cadence.allocated(month, "2023-03-03")).toEqual(0)
		expect(Cadence.allocated(week, "2023-03-03")).toEqual(0)
		expect(Cadence.allocated(single, "2023-03-03")).toEqual(0)
		// same day
		expect(Cadence.allocated(year, "2023-03-04")).toEqual(10)
		expect(Cadence.allocated(month, "2023-03-04")).toEqual(10)
		expect(Cadence.allocated(week, "2023-03-04")).toEqual(10)
		expect(Cadence.allocated(single, "2023-03-04")).toEqual(10)
		// one day after
		expect(Cadence.allocated(year, "2023-03-05")).toEqual(10)
		expect(Cadence.allocated(month, "2023-03-05")).toEqual(10)
		expect(Cadence.allocated(week, "2023-03-05")).toEqual(10)
		expect(Cadence.allocated(single, "2023-03-05")).toEqual(10)
		// monday next week
		expect(Cadence.allocated(week, "2023-03-10")).toEqual(20)
		expect(Cadence.allocated(single, "2024-03-10")).toEqual(10)
		// next week
		expect(Cadence.allocated(year, "2023-03-11")).toEqual(10)
		expect(Cadence.allocated(month, "2023-03-11")).toEqual(10)
		expect(Cadence.allocated(week, "2023-03-11")).toEqual(20)
		expect(Cadence.allocated(single, "2023-03-11")).toEqual(10)
		// monday next month
		expect(Cadence.allocated(month, "2023-04-03")).toEqual(20)
		expect(Cadence.allocated(week, "2023-04-03")).toEqual(60)
		expect(Cadence.allocated(single, "2024-04-03")).toEqual(10)
		// next month same day
		expect(Cadence.allocated(year, "2023-04-04")).toEqual(10)
		expect(Cadence.allocated(month, "2023-04-04")).toEqual(20)
		expect(Cadence.allocated(week, "2023-04-04")).toEqual(60)
		expect(Cadence.allocated(single, "2023-04-04")).toEqual(10)
		// next month next day
		expect(Cadence.allocated(year, "2023-04-05")).toEqual(10)
		expect(Cadence.allocated(month, "2023-04-05")).toEqual(20)
		expect(Cadence.allocated(week, "2023-04-05")).toEqual(60)
		expect(Cadence.allocated(single, "2023-04-05")).toEqual(10)
		// next year same day
		expect(Cadence.allocated(year, "2024-03-04")).toEqual(20)
		expect(Cadence.allocated(month, "2024-03-04")).toEqual(130)
		expect(Cadence.allocated(week, "2024-03-04")).toEqual(540)
		expect(Cadence.allocated(single, "2024-03-04")).toEqual(10)
		// exactly next year
		expect(Cadence.allocated(year, "2024-01-01")).toEqual(20)
		expect(Cadence.allocated(month, "2024-01-01")).toEqual(110)
		expect(Cadence.allocated(week, "2024-01-01")).toEqual(450)
		expect(Cadence.allocated(single, "2024-01-01")).toEqual(10)
	})
})

import { isoly } from "isoly"
import { issuefab } from "../index"

describe("Amount", () => {
	const year: issuefab.Cadence = {
		cadence: "year",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const month: issuefab.Cadence = {
		cadence: "month",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const week: issuefab.Cadence = {
		cadence: "week",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const single: issuefab.Cadence = {
		cadence: "single",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	it("is", () => {
		expect(issuefab.Cadence.is(year)).toEqual(true)
		expect(issuefab.Cadence.is(month)).toEqual(true)
		expect(issuefab.Cadence.is(week)).toEqual(true)
		expect(issuefab.Cadence.is(single)).toEqual(true)
		expect(issuefab.Cadence.is((({ cadence, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is((({ value, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is((({ currency, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is((({ created, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is([1, "EUR"])).toEqual(false)
	})
	it("validate", () => {
		const date = "2023-05-10"
		const past = "2023-01-01"

		const budget: issuefab.Cadence = {
			cadence: "year",
			value: 1_000,
			currency: "EUR",
			created: "2023-01-01",
		}

		expect(issuefab.Cadence.validate(year, past)).toEqual(false)
		expect(issuefab.Cadence.validate(month, past)).toEqual(false)
		expect(issuefab.Cadence.validate(week, past)).toEqual(false)
		expect(issuefab.Cadence.validate(single, past)).toEqual(false)

		expect(issuefab.Cadence.validate(year, date)).toEqual(true)
		expect(issuefab.Cadence.validate(month, date)).toEqual(true)
		expect(issuefab.Cadence.validate(week, date)).toEqual(true)
		expect(issuefab.Cadence.validate(single, date)).toEqual(true)

		expect(issuefab.Cadence.validate(month, date, year)).toEqual(false)
		expect(issuefab.Cadence.validate(week, date, year)).toEqual(false)
		expect(issuefab.Cadence.validate(single, date, year)).toEqual(true)
		expect(issuefab.Cadence.validate(month, "2023-03-04", year)).toEqual(true)
		expect(issuefab.Cadence.validate(week, "2023-03-04", year)).toEqual(true)
		// real use-cases
		expect(issuefab.Cadence.validate(year, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(issuefab.Cadence.validate(month, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(issuefab.Cadence.validate(week, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(issuefab.Cadence.validate(single, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(issuefab.Cadence.validate({ ...year, value: 1_001 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(
			false
		)
		expect(issuefab.Cadence.validate({ ...month, value: 200 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(
			false
		)
		expect(issuefab.Cadence.validate({ ...week, value: 50 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(
			false
		)
	})
	it("allocated", () => {
		// past
		expect(issuefab.Cadence.allocated(year, "2023-03-03")).toEqual(0)
		expect(issuefab.Cadence.allocated(month, "2023-03-03")).toEqual(0)
		expect(issuefab.Cadence.allocated(week, "2023-03-03")).toEqual(0)
		expect(issuefab.Cadence.allocated(single, "2023-03-03")).toEqual(0)
		// same day
		expect(issuefab.Cadence.allocated(year, "2023-03-04")).toEqual(10)
		expect(issuefab.Cadence.allocated(month, "2023-03-04")).toEqual(10)
		expect(issuefab.Cadence.allocated(week, "2023-03-04")).toEqual(10)
		expect(issuefab.Cadence.allocated(single, "2023-03-04")).toEqual(10)
		// one day after
		expect(issuefab.Cadence.allocated(year, "2023-03-05")).toEqual(10)
		expect(issuefab.Cadence.allocated(month, "2023-03-05")).toEqual(10)
		expect(issuefab.Cadence.allocated(week, "2023-03-05")).toEqual(10)
		expect(issuefab.Cadence.allocated(single, "2023-03-05")).toEqual(10)
		// monday next week
		expect(issuefab.Cadence.allocated(week, "2023-03-10")).toEqual(20)
		expect(issuefab.Cadence.allocated(single, "2024-03-10")).toEqual(10)
		// next week
		expect(issuefab.Cadence.allocated(year, "2023-03-11")).toEqual(10)
		expect(issuefab.Cadence.allocated(month, "2023-03-11")).toEqual(10)
		expect(issuefab.Cadence.allocated(week, "2023-03-11")).toEqual(20)
		expect(issuefab.Cadence.allocated(single, "2023-03-11")).toEqual(10)
		// monday next month
		expect(issuefab.Cadence.allocated(month, "2023-04-03")).toEqual(20)
		expect(issuefab.Cadence.allocated(week, "2023-04-03")).toEqual(60)
		expect(issuefab.Cadence.allocated(single, "2024-04-03")).toEqual(10)
		// next month same day
		expect(issuefab.Cadence.allocated(year, "2023-04-04")).toEqual(10)
		expect(issuefab.Cadence.allocated(month, "2023-04-04")).toEqual(20)
		expect(issuefab.Cadence.allocated(week, "2023-04-04")).toEqual(60)
		expect(issuefab.Cadence.allocated(single, "2023-04-04")).toEqual(10)
		// next month next day
		expect(issuefab.Cadence.allocated(year, "2023-04-05")).toEqual(10)
		expect(issuefab.Cadence.allocated(month, "2023-04-05")).toEqual(20)
		expect(issuefab.Cadence.allocated(week, "2023-04-05")).toEqual(60)
		expect(issuefab.Cadence.allocated(single, "2023-04-05")).toEqual(10)
		// next year same day
		expect(issuefab.Cadence.allocated(year, "2024-03-04")).toEqual(20)
		expect(issuefab.Cadence.allocated(month, "2024-03-04")).toEqual(130)
		expect(issuefab.Cadence.allocated(week, "2024-03-04")).toEqual(540)
		expect(issuefab.Cadence.allocated(single, "2024-03-04")).toEqual(10)
		// exactly next year
		expect(issuefab.Cadence.allocated(year, "2024-01-01")).toEqual(20)
		expect(issuefab.Cadence.allocated(month, "2024-01-01")).toEqual(110)
		expect(issuefab.Cadence.allocated(week, "2024-01-01")).toEqual(450)
		expect(issuefab.Cadence.allocated(single, "2024-01-01")).toEqual(10)
	})
})

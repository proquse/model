// import { issuefab } from "../index"
import { isoly } from "isoly"
import { Amount } from "./index"

describe("Amount", () => {
	const year: Amount = {
		cadence: "year",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const month: Amount = {
		cadence: "month",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const week: Amount = {
		cadence: "week",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const single: Amount = {
		cadence: "single",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	it("is", () => {
		expect(Amount.is(year)).toEqual(true)
		expect(Amount.is(month)).toEqual(true)
		expect(Amount.is(week)).toEqual(true)
		expect(Amount.is(single)).toEqual(true)
		expect(Amount.is([1, "EUR"])).toEqual(false)
	})
	it("validate", () => {
		const date = "2023-05-10"
		const past = "2023-01-01"

		const budget: Amount = {
			cadence: "year",
			value: 1_000,
			currency: "EUR",
			created: "2023-01-01",
		}

		expect(Amount.validate(year, past)).toEqual(false)
		expect(Amount.validate(month, past)).toEqual(false)
		expect(Amount.validate(week, past)).toEqual(false)
		expect(Amount.validate(single, past)).toEqual(false)

		expect(Amount.validate(year, date)).toEqual(true)
		expect(Amount.validate(month, date)).toEqual(true)
		expect(Amount.validate(week, date)).toEqual(true)
		expect(Amount.validate(single, date)).toEqual(true)

		expect(Amount.validate(month, date, year)).toEqual(false)
		expect(Amount.validate(week, date, year)).toEqual(false)
		expect(Amount.validate(single, date, year)).toEqual(true)
		expect(Amount.validate(month, "2023-03-04", year)).toEqual(true)
		expect(Amount.validate(week, "2023-03-04", year)).toEqual(true)
		// real use-cases
		expect(Amount.validate(year, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Amount.validate(month, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Amount.validate(week, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Amount.validate(single, isoly.Date.lastOfYear(budget.created), budget)).toEqual(true)
		expect(Amount.validate({ ...year, value: 1_001 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(false)
		expect(Amount.validate({ ...month, value: 200 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(false)
		expect(Amount.validate({ ...week, value: 50 }, isoly.Date.lastOfYear(budget.created), budget)).toEqual(false)
	})
	it("allocated", () => {
		// past
		expect(Amount.allocated(year, "2023-03-03")).toEqual(0)
		expect(Amount.allocated(month, "2023-03-03")).toEqual(0)
		expect(Amount.allocated(week, "2023-03-03")).toEqual(0)
		expect(Amount.allocated(single, "2023-03-03")).toEqual(0)
		// same day
		expect(Amount.allocated(year, "2023-03-04")).toEqual(10)
		expect(Amount.allocated(month, "2023-03-04")).toEqual(10)
		expect(Amount.allocated(week, "2023-03-04")).toEqual(10)
		expect(Amount.allocated(single, "2023-03-04")).toEqual(10)
		// one day after
		expect(Amount.allocated(year, "2023-03-05")).toEqual(10)
		expect(Amount.allocated(month, "2023-03-05")).toEqual(10)
		expect(Amount.allocated(week, "2023-03-05")).toEqual(10)
		expect(Amount.allocated(single, "2023-03-05")).toEqual(10)
		// monday next week
		expect(Amount.allocated(week, "2023-03-10")).toEqual(20)
		expect(Amount.allocated(single, "2024-03-10")).toEqual(10)
		// next week
		expect(Amount.allocated(year, "2023-03-11")).toEqual(10)
		expect(Amount.allocated(month, "2023-03-11")).toEqual(10)
		expect(Amount.allocated(week, "2023-03-11")).toEqual(20)
		expect(Amount.allocated(single, "2023-03-11")).toEqual(10)
		// monday next month
		expect(Amount.allocated(month, "2023-04-03")).toEqual(20)
		expect(Amount.allocated(week, "2023-04-03")).toEqual(60)
		expect(Amount.allocated(single, "2024-04-03")).toEqual(10)
		// next month same day
		expect(Amount.allocated(year, "2023-04-04")).toEqual(10)
		expect(Amount.allocated(month, "2023-04-04")).toEqual(20)
		expect(Amount.allocated(week, "2023-04-04")).toEqual(60)
		expect(Amount.allocated(single, "2023-04-04")).toEqual(10)
		// next month next day
		expect(Amount.allocated(year, "2023-04-05")).toEqual(10)
		expect(Amount.allocated(month, "2023-04-05")).toEqual(20)
		expect(Amount.allocated(week, "2023-04-05")).toEqual(60)
		expect(Amount.allocated(single, "2023-04-05")).toEqual(10)
		// next year same day
		expect(Amount.allocated(year, "2024-03-04")).toEqual(20)
		expect(Amount.allocated(month, "2024-03-04")).toEqual(130)
		expect(Amount.allocated(week, "2024-03-04")).toEqual(540)
		expect(Amount.allocated(single, "2024-03-04")).toEqual(10)
		// exactly next year
		expect(Amount.allocated(year, "2024-01-01")).toEqual(20)
		expect(Amount.allocated(month, "2024-01-01")).toEqual(110)
		expect(Amount.allocated(week, "2024-01-01")).toEqual(450)
		expect(Amount.allocated(single, "2024-01-01")).toEqual(10)
	})
})

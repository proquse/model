import { isoly } from "isoly"
import { proquse } from "../index"
import { Cadence } from "."

describe("Amount", () => {
	const year: proquse.Cadence = {
		interval: "year",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const month: proquse.Cadence = {
		interval: "month",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const week: proquse.Cadence = {
		interval: "week",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const day: proquse.Cadence = {
		interval: "day",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const single: proquse.Cadence = {
		interval: "single",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	it("is", () => {
		expect(proquse.Cadence.is(year)).toEqual(true)
		expect(proquse.Cadence.is(month)).toEqual(true)
		expect(proquse.Cadence.is(week)).toEqual(true)
		expect(proquse.Cadence.is(single)).toEqual(true)
		expect(proquse.Cadence.is((({ interval, ...year }) => year)(year))).toEqual(false)
		expect(proquse.Cadence.is((({ value, ...year }) => year)(year))).toEqual(false)
		expect(proquse.Cadence.is((({ currency, ...year }) => year)(year))).toEqual(false)
		expect(proquse.Cadence.is((({ created, ...year }) => year)(year))).toEqual(false)
		expect(proquse.Cadence.is([1, "EUR"])).toEqual(false)
	})
	it("allocated", () => {
		// past
		expect(proquse.Cadence.allocated(year, "2023-03-03")).toEqual(0)
		expect(proquse.Cadence.allocated(month, "2023-03-03")).toEqual(0)
		expect(proquse.Cadence.allocated(week, "2023-03-03")).toEqual(0)
		expect(proquse.Cadence.allocated(single, "2023-03-03")).toEqual(0)
		// same day
		expect(proquse.Cadence.allocated(year, "2023-03-04")).toEqual(10)
		expect(proquse.Cadence.allocated(month, "2023-03-04")).toEqual(10)
		expect(proquse.Cadence.allocated(week, "2023-03-04")).toEqual(10)
		expect(proquse.Cadence.allocated(single, "2023-03-04")).toEqual(10)
		// one day after
		expect(proquse.Cadence.allocated(year, "2023-03-05")).toEqual(10)
		expect(proquse.Cadence.allocated(month, "2023-03-05")).toEqual(10)
		expect(proquse.Cadence.allocated(week, "2023-03-05")).toEqual(10)
		expect(proquse.Cadence.allocated(single, "2023-03-05")).toEqual(10)
		// monday next week
		expect(proquse.Cadence.allocated(week, "2023-03-10")).toEqual(20)
		expect(proquse.Cadence.allocated(single, "2024-03-10")).toEqual(10)
		// next week
		expect(proquse.Cadence.allocated(year, "2023-03-11")).toEqual(10)
		expect(proquse.Cadence.allocated(month, "2023-03-11")).toEqual(10)
		expect(proquse.Cadence.allocated(week, "2023-03-11")).toEqual(20)
		expect(proquse.Cadence.allocated(single, "2023-03-11")).toEqual(10)
		// monday next month
		expect(proquse.Cadence.allocated(month, "2023-04-03")).toEqual(20)
		expect(proquse.Cadence.allocated(week, "2023-04-03")).toEqual(60)
		expect(proquse.Cadence.allocated(single, "2024-04-03")).toEqual(10)
		// next month same day
		expect(proquse.Cadence.allocated(year, "2023-04-04")).toEqual(10)
		expect(proquse.Cadence.allocated(month, "2023-04-04")).toEqual(20)
		expect(proquse.Cadence.allocated(week, "2023-04-04")).toEqual(60)
		expect(proquse.Cadence.allocated(single, "2023-04-04")).toEqual(10)
		// next month next day
		expect(proquse.Cadence.allocated(year, "2023-04-05")).toEqual(10)
		expect(proquse.Cadence.allocated(month, "2023-04-05")).toEqual(20)
		expect(proquse.Cadence.allocated(week, "2023-04-05")).toEqual(60)
		expect(proquse.Cadence.allocated(single, "2023-04-05")).toEqual(10)
		// next year same day
		expect(proquse.Cadence.allocated(year, "2024-03-04")).toEqual(20)
		expect(proquse.Cadence.allocated(month, "2024-03-04")).toEqual(130)
		expect(proquse.Cadence.allocated(week, "2024-03-04")).toEqual(540)
		expect(proquse.Cadence.allocated(single, "2024-03-04")).toEqual(10)
		// exactly next year
		expect(proquse.Cadence.allocated(year, "2024-01-01")).toEqual(20)
		expect(proquse.Cadence.allocated(month, "2024-01-01")).toEqual(110)
		expect(proquse.Cadence.allocated(week, "2024-01-01")).toEqual(450)
		expect(proquse.Cadence.allocated(single, "2024-01-01")).toEqual(10)
		// days
		expect(proquse.Cadence.allocated(day, "2023-03-04")).toEqual(10)
		expect(proquse.Cadence.allocated(day, "2023-03-05")).toEqual(20)
		expect(proquse.Cadence.allocated(day, "2023-03-06")).toEqual(30)
		expect(proquse.Cadence.allocated(day, "2023-03-06", { limit: 20 })).toEqual(20)
	})
	it("sustainable", () => {
		let parent: proquse.Cadence
		let children: proquse.Cadence[]
		let end: isoly.Date
		let date: isoly.Date
		let used: number

		// all used
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "single",
			value: 200,
		}
		children = [
			{
				created: "2023-01-01",
				currency: "EUR",
				interval: "day",
				value: 1,
			},
		]
		expect(proquse.Cadence.sustainable(parent, children, "2024-01-01")).toEqual(199)

		// calculating the end date
		end = "2023-02-01"
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "single",
			value: 200,
		}
		children = [
			{
				created: "2023-01-01",
				currency: "EUR",
				interval: "day",
				value: 1,
			},
		]
		expect(isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))).toEqual(end)

		// slightly before the end
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "single",
			value: 350,
		}
		children = [
			{
				created: "2023-01-30",
				currency: "EUR",
				interval: "year",
				value: 10,
			},
			{
				created: "2023-02-20",
				currency: "EUR",
				interval: "month",
				value: 5,
			},
			{
				created: "2023-05-05",
				currency: "EUR",
				interval: "week",
				value: 3,
			},
		]
		end = "2025-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		used = children.reduce((result, child) => result + Cadence.allocated(child, date), 0)
		expect(date <= end).toEqual(true)
		expect(parent.created <= date).toEqual(true)
		expect(used <= proquse.Cadence.allocated(parent, end)).toEqual(true)

		// good approximation
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "single",
			value: 140,
		}
		children = [
			{
				created: "2023-01-05",
				currency: "EUR",
				interval: "day",
				value: 10,
			},
			{
				created: "2023-01-13",
				currency: "EUR",
				interval: "day",
				value: 5,
			},
		]
		end = "2024-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		used = children.reduce((result, child) => result + Cadence.allocated(child, date), 0)
		expect(date <= end).toEqual(true)
		expect(parent.created <= date).toEqual(true)
		expect(used == 140).toEqual(true)

		// sustainable only day 0
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "single",
			value: 140,
		}
		children = [
			{
				created: "2023-01-01",
				currency: "EUR",
				interval: "day",
				value: 140,
			},
		]
		end = "2024-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		expect(date).toEqual(parent.created)

		// unsustainable from day 0
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "single",
			value: 140,
		}
		children = [
			{
				created: "2023-01-01",
				currency: "EUR",
				interval: "week",
				value: 200,
			},
		]
		end = "2024-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		expect(date).toEqual("2022-12-31")

		// parent growing faster than children
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "week",
			value: 140,
		}
		children = [
			{
				created: "2023-01-01",
				currency: "EUR",
				interval: "week",
				value: 100,
			},
		]
		end = "2024-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		expect(date).toEqual(end)

		// parent growing slower than children
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "month",
			value: 400,
		}
		children = [
			{
				created: "2023-02-01",
				currency: "EUR",
				interval: "month",
				value: 400,
			},
			{
				created: "2023-03-01",
				currency: "EUR",
				interval: "month",
				value: 100,
			},
		]
		end = "2024-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		expect(date).toEqual("2023-06-30")

		// yearly growth over long time
		// slowest test so far ~8-10ms
		// this calculation is unrealistic to exist in the application
		parent = {
			created: "2023-01-01",
			currency: "EUR",
			interval: "year",
			value: 400,
		}
		children = [
			{
				created: "2025-02-01",
				currency: "EUR",
				interval: "month",
				value: 200,
			},
			{
				created: "2023-03-01",
				currency: "EUR",
				interval: "year",
				value: 100,
			},
		]
		end = "2034-01-01"
		date = isoly.Date.next(parent.created, proquse.Cadence.sustainable(parent, children, end))
		expect(date < end).toEqual(true)
	})
})

import { isoly } from "isoly"
import { issuefab } from "../index"

describe("Amount", () => {
	const year: issuefab.Cadence = {
		interval: "year",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const month: issuefab.Cadence = {
		interval: "month",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const week: issuefab.Cadence = {
		interval: "week",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const day: issuefab.Cadence = {
		interval: "day",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	const single: issuefab.Cadence = {
		interval: "single",
		value: 10,
		currency: "EUR",
		created: "2023-03-04",
	}
	it("is", () => {
		expect(issuefab.Cadence.is(year)).toEqual(true)
		expect(issuefab.Cadence.is(month)).toEqual(true)
		expect(issuefab.Cadence.is(week)).toEqual(true)
		expect(issuefab.Cadence.is(single)).toEqual(true)
		expect(issuefab.Cadence.is((({ interval, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is((({ value, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is((({ currency, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is((({ created, ...year }) => year)(year))).toEqual(false)
		expect(issuefab.Cadence.is([1, "EUR"])).toEqual(false)
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
		// days
		expect(issuefab.Cadence.allocated(day, "2023-03-04")).toEqual(10)
		expect(issuefab.Cadence.allocated(day, "2023-03-05")).toEqual(20)
		expect(issuefab.Cadence.allocated(day, "2023-03-06")).toEqual(30)
		expect(issuefab.Cadence.allocated(day, "2023-03-06", { cap: 20 })).toEqual(20)
	})
	it("sustainable", () => {
		// const start = performance.now()
		// expect(
		// 	issuefab.Cadence.sustainable(
		// 		{
		// 			created: "2023-01-01",
		// 			currency: "EUR",
		// 			interval: "single",
		// 			value: 205,
		// 		},
		// 		[
		// 			{
		// 				created: "2023-02-05",
		// 				currency: "EUR",
		// 				interval: "week",
		// 				value: 10,
		// 			},
		// 		],
		// 		"2024-01-01"
		// 	)
		// ).toBeTruthy()
		// const end = performance.now()
		// console.log("calculation speed", end - start)
		// expect(
		// 	issuefab.Cadence.sustainable(
		// 		{
		// 			created: "2023-01-01",
		// 			currency: "EUR",
		// 			interval: "single",
		// 			value: 100_000,
		// 		},
		// 		[
		// 			{
		// 				created: "2023-02-05",
		// 				currency: "EUR",
		// 				interval: "week",
		// 				value: 10,
		// 			},
		// 			{
		// 				created: "2023-02-13",
		// 				currency: "EUR",
		// 				interval: "day",
		// 				value: 5,
		// 			},
		// 		],
		// 		"2024-01-01"
		// 	)
		// ).toEqual(undefined)

		const parent: issuefab.Cadence = {
			created: "2023-02-01",
			currency: "EUR",
			interval: "single",
			value: 140,
		}
		const children: issuefab.Cadence[] = [
			{
				created: "2023-02-05",
				currency: "EUR",
				interval: "week",
				value: 10,
			},
			// {
			// 	created: "2023-02-13",
			// 	currency: "EUR",
			// 	interval: "day",
			// 	value: 5,
			// },
		]
		const end = "2024-01-01"
		// const approximateMaxDays = issuefab.Cadence.approximate(parent, children, end)
		const maxDays = issuefab.Cadence.sustainable(parent, children, end)
		const maxDate = isoly.Date.next(parent.created, maxDays)

		const childCost = children.map(child => issuefab.Cadence.allocated(child, isoly.Date.next(maxDate, 0)))
		const used = childCost.reduce((result, next) => result + next, 0)

		// console.log(approximateMaxDays)
		console.log(used)
	})
})

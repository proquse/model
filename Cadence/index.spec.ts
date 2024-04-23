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
	it("add", () => {
		const center: proquse.CostCenter = {
			from: "jessie@rocket.com",
			name: "Development",
			amount: {
				value: 3000,
				currency: "EUR",
				interval: "single",
				created: "2024-04-22",
			},
			id: "------c1",
			created: "2024-04-22T07:50:56.564Z",
			modified: "2024-04-22T07:50:56.564Z",
			usage: [
				{
					from: "jessie@rocket.com",
					to: ["jessie@rocket.com"],
					purpose: "Hosting",
					amount: {
						value: 3000,
						currency: "EUR",
						interval: "single",
						created: "2024-04-22",
					},
					costCenter: "Development",
					id: "----d1c1",
					created: "2024-04-22T07:53:09.776Z",
					modified: "2024-04-22T07:53:09.776Z",
					usage: [
						{
							purpose: "Domain",
							payment: {
								type: "card",
								limit: {
									value: 1000,
									currency: "GBP",
									interval: "week",
									created: "2024-04-22",
								},
								rates: {
									EUR: 1.1620947920721894,
								},
								reference: "supplier|abcqwe12",
								mask: "487184******3096",
								expires: {
									month: 5,
									year: 24,
								},
								holder: "Rocket AB",
							},
							buyer: "jessie@rocket.com",
							id: "--p1d1c1",
							type: "purchase",
							email: "receipt+--p1d1c1_----d1c1@proquse.com",
							created: "2024-04-22T08:37:34.912Z",
							modified: "2024-04-22T08:37:34.912Z",
							receipts: [],
							transactions: [],
						},
					],
					type: "delegation",
				},
			],
			type: "costCenter",
		}
		const cadence: Omit<proquse.Cadence, "created"> = { value: 500, currency: "GBP", interval: "week" }
		// (1_162 - 3_000) >= 500
		expect(Cadence.check(center, center.usage[0].id, { ...cadence, created: "2024-04-22" })).toEqual(true)
		// (2_324 - 3_000) >= 500
		expect(Cadence.check(center, center.usage[0].id, { ...cadence, created: "2024-04-29" })).toEqual(true)
		// (3_486 - 3_000) >= 500
		expect(Cadence.check(center, center.usage[0].id, { ...cadence, created: "2024-05-06" })).toEqual(false)
		// (4_648 - 3_000) >= 500
		expect(Cadence.check(center, center.usage[0].id, { ...cadence, created: "2024-05-13" })).toEqual(false)
		// (4_648 - 3_000) >= 2000
		expect(
			Cadence.check(center, center.usage[0].id, { ...cadence, created: "2024-04-22" }, { date: "2024-05-13" })
		).toEqual(false)
	})
})

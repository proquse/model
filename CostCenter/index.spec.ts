import { isoly } from "isoly"
import { proquse } from "../index"

describe("CostCenter", () => {
	it("exports", () => {
		expect(typeof proquse.CostCenter.is).toEqual("function")
		expect(typeof proquse.CostCenter.change).toEqual("function")
		expect(typeof proquse.CostCenter.create).toEqual("function")
		expect(typeof proquse.CostCenter.find).toEqual("function")
		expect(typeof proquse.CostCenter.remove).toEqual("function")
		expect(typeof proquse.CostCenter.validate).toEqual("function")
		expect(proquse.CostCenter.findUser).toEqual(proquse.Delegation.findUser)
		expect(proquse.CostCenter.findParent).toEqual(proquse.Delegation.findParent)
		expect(proquse.CostCenter.findParents).toEqual(proquse.Delegation.findParents)
		expect(proquse.CostCenter.path).toEqual(proquse.Delegation.path)
		expect(proquse.CostCenter.allocated).toEqual(proquse.Delegation.allocated)
		expect(proquse.CostCenter.spent).toEqual(proquse.Delegation.spent)
	})
	it("is", () => {
		const costCenter: proquse.CostCenter = {
			id: "11111111",
			amount: { interval: "year", value: 10, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			usage: [],
			type: "costCenter",
		}
		expect(proquse.CostCenter.is(costCenter)).toEqual(true)
		expect(proquse.CostCenter.is({ ...costCenter, to: [] })).toEqual(true)
		expect(proquse.CostCenter.type.get({ ...costCenter, to: ["james@proquse.com"] })).toEqual(costCenter)
		expect(proquse.CostCenter.is((({ id, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ amount, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ name, ...rest }) => rest)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ created, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ modified, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ from, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ description, ...costCenter }) => costCenter)(costCenter))).toEqual(true)
		expect(proquse.CostCenter.is((({ usage, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(proquse.CostCenter.is((({ usage, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
	})
	it("change", () => {
		const costCenter: proquse.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "d1",
					amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
					costCenter: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					type: "delegation",
					usage: [],
				},
				{
					id: "c2222222",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [
						{
							id: "c2d11111",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2021-12-20T13:37:42Z",
							modified: "2022-12-20T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							type: "delegation",
							usage: [],
						},
					],
				},
			],
		}
		let result = proquse.CostCenter.change([costCenter], {
			...costCenter,
			amount: { interval: "year", value: 600, currency: "USD", created: "2023-01-01" },
			name: "Cars",
		})
		expect(result?.root).toBe(costCenter)
		expect(result?.root).toBe(result?.changed)
		expect(result?.root?.amount.value).toEqual(600)
		expect(costCenter.name).toEqual("Cars")
		expect(costCenter.usage[0].type == "delegation" ? costCenter.usage[0].costCenter : "").toEqual("Cars")
		expect(costCenter.usage[1].type == "costCenter" ? costCenter.usage[1].name : "").not.toEqual("Cars")
		expect(
			costCenter.usage[1].usage[0].type == "delegation" ? costCenter.usage[1].usage[0].costCenter : ""
		).not.toEqual("Cars")
		const oldCostCenter = costCenter.usage[1]
		if (!proquse.CostCenter.is(oldCostCenter)) {
			const flaw = proquse.CostCenter.type.flaw(oldCostCenter)
			console.log(flaw, oldCostCenter)
			expect(proquse.CostCenter.is(oldCostCenter)).toEqual(true)
			return
		}
		result = proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			name: "NewName",
		})
		expect(result?.root).toBe(costCenter)
		expect(result?.root).not.toBe(result?.changed)
		expect(result?.changed).toBe(costCenter.usage[1])
		expect(costCenter.name).toEqual("Cars")
		expect(costCenter.usage[1].type == "costCenter" ? costCenter.usage[1].name : "").toEqual("NewName")
		expect(costCenter.usage[1].usage[0].type == "delegation" ? costCenter.usage[1].usage[0].costCenter : "").toEqual(
			"NewName"
		)
		expect(
			costCenter.usage[1].usage[0].type == "delegation" ? costCenter.usage[1].usage[0].costCenter : ""
		).not.toEqual("RandomName")
		expect(costCenter.usage[0].type == "delegation" ? costCenter.usage[0].costCenter : "").not.toEqual("NewName")
		expect(costCenter.usage[0].type == "delegation" ? costCenter.usage[0].costCenter : "").toEqual("Cars")
	})
	it("create", () => {
		const creatable: proquse.CostCenter.Creatable = {
			amount: { interval: "year", value: 1_600, currency: "USD", created: "2023-01-01" },
			from: "jessie@example.com",
			description: "buy things",
			name: "fun",
		}
		expect(proquse.CostCenter.is(proquse.CostCenter.create(creatable))).toEqual(true)
		expect(proquse.CostCenter.create(creatable, { id: "d4" }).id).toEqual("d4")
		expect(proquse.CostCenter.create(creatable, { from: "james@proquse.com" }).from).toEqual("james@proquse.com")
		expect(proquse.CostCenter.is(proquse.CostCenter.create(creatable, { from: undefined }))).toEqual(false)
	})
	it("find", () => {
		const costCenter: proquse.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [
						{
							id: "d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2021-12-20T13:37:42Z",
							modified: "2022-12-20T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							type: "delegation",
							usage: [],
						},
					],
				},
			],
		}
		let result:
			| {
					root: proquse.CostCenter | proquse.Delegation | undefined
					found: proquse.CostCenter | proquse.Delegation | undefined
			  }
			| undefined
		result = proquse.CostCenter.find([costCenter], "c2")
		expect(result?.root).toBe(costCenter)
		expect(result?.found).toBe(costCenter.usage[0])
		result = proquse.CostCenter.find([costCenter], "c1")
		expect(result?.root).toBe(costCenter)
		expect(result?.found).toBe(costCenter)
		result = proquse.CostCenter.find([costCenter], "d1")
		expect(result).toEqual(undefined)
		result = proquse.CostCenter.find.node([costCenter], "d1")
		expect(result?.root).toBe(costCenter)
		expect(result?.found).toBe(costCenter.usage[0].usage[0])
		result = proquse.CostCenter.find.node([costCenter], "d2")
		expect(result).toEqual(undefined)
	})
	it("remove", () => {
		const costCenter: proquse.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [
						{
							id: "d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2021-12-20T13:37:42Z",
							modified: "2022-12-20T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							type: "delegation",
							usage: [],
						},
					],
				},
			],
		}
		let result = proquse.CostCenter.remove([costCenter], "d1")
		expect(result).toEqual(undefined)
		result = proquse.CostCenter.remove([costCenter], "c2")
		expect(result?.root).toBe(costCenter)
		expect(result?.removed.id).toEqual("c2")
		expect(costCenter.usage.length).toEqual(0)
		result = proquse.CostCenter.remove([costCenter], "c1")
		const costCenters = [costCenter]
		result = proquse.CostCenter.remove(costCenters, "c1")
		expect(result?.root).toBe(result?.removed)
		expect(result).toBe(undefined)
		expect(costCenters.length).toEqual(1)
	})
	it("validate", () => {
		let costCenter: proquse.CostCenter = {
			id: "------c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "------c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [
						{
							id: "------d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2023-01-01T13:37:42Z",
							modified: "2024-01-01T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							type: "delegation",
							usage: [],
						},
					],
				},
			],
		}
		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({ status: true })
		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01", spent: true })).toEqual({ status: true })
		// expect(
		// 	proquse.CostCenter.validate(
		// 		{
		// 			usage: [costCenter],
		// 			name: "Currencies don't match",
		// 			id: "currErr1",
		// 			amount: { interval: "year", value: 600, currency: "EUR", created: "2023-01-01" },
		// 			created: "2023-01-01T10:37:42Z",
		// 			modified: "2024-01-01T11:37:42Z",
		// 			from: "jessie@example.com",
		// 			description: "description",
		// 			type: "costCenter",
		// 		},
		// 		{ date: "2023-01-01", limit: 600 }
		// 	)
		// ).toEqual({ status: false, reason: "currency", origin: costCenter })
		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01", limit: 400 })).toEqual({
		// 	status: false,
		// 	origin: costCenter,
		// 	reason: "overallocated",
		// })
		const oldCostCenter = costCenter.usage[0]
		if (!proquse.CostCenter.is(oldCostCenter)) {
			expect(proquse.CostCenter.is(oldCostCenter)).toEqual({ status: true })
			return
		}
		proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			amount: { interval: "year", value: 700, currency: "USD", created: "2023-01-01" },
		})

		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({
		// 	status: false,
		// 	reason: "overallocated",
		// 	origin: costCenter,
		// })
		proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			amount: { interval: "year", value: 200, currency: "USD", created: "2023-01-01" },
		})
		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({
		// 	status: false,
		// 	reason: "overallocated",
		// 	origin: costCenter.usage[0],
		// })
		proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
		})
		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({ status: true })

		const oldDelegation = oldCostCenter.usage[0]
		if (!proquse.Delegation.is(oldDelegation)) {
			expect(proquse.Delegation.is(oldDelegation)).toEqual({ status: true })
			return
		}

		proquse.Delegation.change([costCenter], {
			...oldDelegation,
			amount: { interval: "year", value: 600, currency: "USD", created: "2023-01-01" },
		})
		// expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({
		// 	status: false,
		// 	reason: "overallocated",
		// 	origin: costCenter.usage[0],
		// })

		proquse.Delegation.change([costCenter], {
			...oldDelegation,
			amount: { interval: "year", value: 400, currency: "EUR", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({
			status: false,
			reason: "currency",
			origin: costCenter.usage[0].usage[0],
		})

		proquse.Delegation.change([costCenter], {
			...oldDelegation,
			amount: { interval: "year", value: 200, currency: "USD", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual({ status: true })

		// running out of resources early is ok
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "d1",
					amount: { interval: "month", value: 100, currency: "USD", created: "2023-03-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					type: "delegation",
					usage: [],
				},
				{
					id: "c2",
					amount: { interval: "month", value: 400, currency: "USD", created: "2023-02-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [],
				},
			],
		}
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-06-01" })).toEqual({ status: true })
		expect(
			isoly.Date.next(
				isoly.DateTime.getDate(costCenter.created),
				proquse.Cadence.sustainable(
					costCenter.amount,
					[costCenter.usage[0].amount, costCenter.usage[1].amount],
					"2023-12-31"
				)
			)
		).not.toEqual("2023-12-31")
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual({ status: true })

		// running out of resources on day 0 is ok
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "d1",
					amount: { interval: "month", value: 100, currency: "USD", created: "2023-01-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					type: "delegation",
					usage: [],
				},
				{
					id: "c2",
					amount: { interval: "month", value: 300, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [],
				},
			],
		}
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual({ status: true })

		// running out of resources before day 0 is not ok
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "d1",
					amount: { interval: "month", value: 100, currency: "USD", created: "2023-01-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					type: "delegation",
					usage: [],
				},
				{
					id: "c2",
					amount: { interval: "month", value: 300, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [],
				},
			],
		}
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual({ status: true })
		costCenter.usage[0].amount.value = 101
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual({
			status: false,
			reason: "overallocated",
			origin: costCenter,
		})

		// not ok to overspend with single
		// This one is not quite working with a single at the bottom
		// it does NOT like to run out of resources early at all
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			type: "costCenter",
			usage: [
				{
					id: "d1",
					amount: { interval: "month", value: 200, currency: "USD", created: "2023-02-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					type: "delegation",
					usage: [
						{
							id: "d2",
							amount: { interval: "single", value: 300, currency: "USD", created: "2023-03-15" },
							costCenter: "Development",
							created: "2023-01-01T13:37:42Z",
							modified: "2024-01-01T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							type: "delegation",
							usage: [],
						},
					],
				},
				{
					id: "c2",
					amount: { interval: "month", value: 300, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					type: "costCenter",
					usage: [],
				},
			],
		}
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-03-15" })).toEqual({
			status: false,
			reason: "overallocated",
			origin: costCenter.usage[0],
		})

		costCenter = {
			from: "jessie@example.com",
			name: "insta warning",
			amount: { value: 100, currency: "EUR", interval: "single", created: "2023-09-07" },
			id: "vAw9hMxQ",
			created: "2023-09-07T09:11:38.198Z",
			modified: "2023-09-07T09:11:38.198Z",
			type: "costCenter",
			usage: [
				{
					from: "jessie@example.com",
					name: "Too much",
					amount: { value: 10, currency: "EUR", interval: "day", created: "2023-09-07" },
					id: "uBSPAELO",
					created: "2023-09-07T09:12:06.566Z",
					modified: "2023-09-07T09:12:06.566Z",
					type: "costCenter",
					usage: [],
				},
				{
					from: "jessie@example.com",
					name: "moore",
					amount: { value: 50, currency: "EUR", interval: "single", created: "2023-09-07" },
					id: "ZVTbB-TD",
					created: "2023-09-07T09:52:22.731Z",
					modified: "2023-09-07T09:52:22.731Z",
					type: "costCenter",
					usage: [],
				},
			],
		}
		expect(proquse.CostCenter.validate(costCenter)).toEqual({ status: true })
		const root: proquse.CostCenter = {
			from: "jessie@rocket.com",
			name: "Development",
			amount: { value: 5000, currency: "EUR", interval: "single", created: "2024-04-22" },
			id: "------c1",
			created: "2024-04-22T07:50:56.564Z",
			modified: "2024-04-22T07:50:56.564Z",
			usage: [
				{
					from: "jessie@rocket.com",
					to: ["jessie@rocket.com"],
					purpose: "Hosting",
					amount: { value: 2500, currency: "EUR", interval: "single", created: "2024-04-22" },
					costCenter: "Development",
					id: "----d1c1",
					created: "2024-04-22T07:53:09.776Z",
					modified: "2024-04-22T07:53:09.776Z",
					usage: [
						{
							purpose: "Domain",
							payment: {
								type: "card",
								limit: { value: 15, currency: "GBP", interval: "single", created: "2024-04-22" },
								rates: { EUR: 1.1620947920721894 },
								reference: "supplier|V500014TS4",
								mask: "482384******3546",
								expires: { month: 5, year: 24 },
								holder: "Rocket AB",
							},
							buyer: "jessie@rocket.com",
							id: "wExqZ244",
							type: "purchase",
							email: "receipt+asdqweaq_asdqweaq@rocket.com",
							created: "2024-04-22T08:37:34.912Z",
							modified: "2024-04-22T08:37:34.912Z",
							receipts: [],
							transactions: [],
						},
						{
							from: "jessie@rocket.com",
							to: ["jessie@rocket.com"],
							purpose: "Pi",
							amount: { value: 70, currency: "EUR", interval: "single", created: "2024-04-23" },
							costCenter: "Development",
							id: "--p1d1c1",
							created: "2024-04-23T07:17:44.680Z",
							modified: "2024-04-23T07:17:44.680Z",
							usage: [
								{
									purpose: "Pi",
									payment: {
										type: "card",
										limit: { value: 70, currency: "GBP", interval: "single", created: "2024-04-23" },
										rates: { EUR: 1.1620947920721894 },
										reference: "supplier|V214314UDV",
										mask: "507184******0039",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "--p2d1c1",
									type: "purchase",
									email: "receipt+asdqweaq_asdqweaq@rocket.com",
									created: "2024-04-23T08:40:02.203Z",
									modified: "2024-04-24T07:17:30.840Z",
									receipts: [],
									transactions: [],
								},
							],
							type: "delegation",
						},
					],
					type: "delegation",
				},
			],
			type: "costCenter",
		}
		expect(proquse.CostCenter.validate(root)).toEqual({
			status: false,
			reason: "overallocated",
			origin: root.usage[0].usage[1],
		})
		const original: proquse.CostCenter = {
			from: "jessie@rocket.com",
			name: "Development",
			amount: { value: 5000, currency: "EUR", interval: "single", created: "2024-04-22" },
			id: "------c1",
			created: "2024-04-22T07:50:56.564Z",
			modified: "2024-04-22T07:50:56.564Z",
			usage: [
				{
					from: "jessie@rocket.com",
					to: ["jessie@rocket.com"],
					purpose: "Hosting",
					amount: { value: 2500, currency: "EUR", interval: "single", created: "2024-04-22" },
					costCenter: "Development",
					id: "----d1c1",
					created: "2024-04-22T07:53:09.776Z",
					modified: "2024-04-22T07:53:09.776Z",
					usage: [
						{
							purpose: "Domain",
							payment: {
								type: "card",
								limit: { value: 15, currency: "GBP", interval: "single", created: "2024-04-22" },
								rates: { EUR: 1.1620947920721894 },
								reference: "modulr|V500014TS4",
								mask: "500184******3096",
								expires: { month: 5, year: 24 },
								holder: "Rocket AB",
							},
							buyer: "jessie@rocket.com",
							id: "--p1d1c1",
							type: "purchase",
							email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
							created: "2024-04-22T08:37:34.912Z",
							modified: "2024-04-22T08:37:34.912Z",
							receipts: [],
							transactions: [],
						},
						{
							from: "jessie@rocket.com",
							to: ["jessie@rocket.com"],
							purpose: "Pi",
							amount: { value: 70, currency: "EUR", interval: "single", created: "2024-04-23" },
							costCenter: "Development",
							id: "--d1d1c1",
							created: "2024-04-23T07:17:44.680Z",
							modified: "2024-04-23T07:17:44.680Z",
							usage: [
								{
									purpose: "Pi",
									payment: {
										type: "card",
										limit: { value: 50, currency: "GBP", interval: "single", created: "2024-04-23" },
										rates: { EUR: 1.1620947920721894 },
										reference: "modulr|V500014UDV",
										mask: "500184******6539",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "p1d1d1c1",
									type: "purchase",
									email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
									created: "2024-04-23T08:40:02.203Z",
									modified: "2024-04-24T07:56:26.126Z",
									receipts: [],
									transactions: [
										{
											receipts: [],
											reference: "729691",
											card: { reference: "modulr|V500014UDV" },
											merchant: { descriptor: "merchant", country: "GB", category: "5000" },
											operations: [
												{
													type: "capture",
													reference: "aaaaaaaa",
													amount: {
														account: { value: 50, currency: "GBP" },
														merchant: { value: 50, currency: "GBP" },
														rate: 1,
													},
													status: "success",
													modified: "2024-04-26T02:00:02.000Z",
													created: "2024-04-26T02:00:02.000Z",
												},
											],
											status: "finalized",
											amount: { value: 50, currency: "GBP" },
											modified: "2024-04-26T02:00:02.000Z",
											created: "2024-04-26T02:00:02.000Z",
										},
									],
								},
								{
									purpose: "Hat",
									payment: {
										type: "card",
										limit: { value: 5, currency: "GBP", interval: "single", created: "2024-04-24" },
										rates: { EUR: 1.1620947920721894 },
										reference: "modulr|V500014V2M",
										mask: "500184******5762",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "p2d1d1c1",
									type: "purchase",
									email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
									created: "2024-04-24T09:05:31.860Z",
									modified: "2024-04-29T12:32:59.220Z",
									receipts: [],
									transactions: [],
								},
							],
							type: "delegation",
						},
					],
					type: "delegation",
				},
			],
			type: "costCenter",
		}
		const change: proquse.CostCenter = {
			from: "jessie@rocket.com",
			name: "Development",
			amount: { value: 5000, currency: "EUR", interval: "single", created: "2024-04-22" },
			id: "------c1",
			created: "2024-04-22T07:50:56.564Z",
			modified: "2024-04-22T07:50:56.564Z",
			usage: [
				{
					from: "jessie@rocket.com",
					to: ["jessie@rocket.com"],
					purpose: "Hosting",
					amount: { value: 2500, currency: "EUR", interval: "single", created: "2024-04-22" },
					costCenter: "Development",
					id: "----d1c1",
					created: "2024-04-22T07:53:09.776Z",
					modified: "2024-04-22T07:53:09.776Z",
					usage: [
						{
							purpose: "Domain",
							payment: {
								type: "card",
								limit: { value: 15, currency: "GBP", interval: "single", created: "2024-04-22" },
								rates: { EUR: 1.1620947920721894 },
								reference: "modulr|V500014TS4",
								mask: "500184******3096",
								expires: { month: 5, year: 24 },
								holder: "Rocket AB",
							},
							buyer: "jessie@rocket.com",
							id: "--p1d1c1",
							type: "purchase",
							email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
							created: "2024-04-22T08:37:34.912Z",
							modified: "2024-04-22T08:37:34.912Z",
							receipts: [],
							transactions: [],
						},
						{
							from: "jessie@rocket.com",
							to: ["jessie@rocket.com"],
							purpose: "Pi",
							amount: { value: 70, currency: "EUR", interval: "single", created: "2024-04-23" },
							costCenter: "Development",
							id: "--d1d1c1",
							created: "2024-04-23T07:17:44.680Z",
							modified: "2024-04-23T07:17:44.680Z",
							usage: [
								{
									purpose: "Pi",
									payment: {
										type: "card",
										limit: { value: 50, currency: "GBP", interval: "single", created: "2024-04-23" },
										rates: { EUR: 1.1620947920721894 },
										reference: "modulr|V500014UDV",
										mask: "500184******6539",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "p1d1d1c1",
									type: "purchase",
									email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
									created: "2024-04-23T08:40:02.203Z",
									modified: "2024-04-24T07:56:26.126Z",
									receipts: [],
									transactions: [
										{
											receipts: [],
											reference: "729691",
											card: { reference: "modulr|V500014UDV" },
											merchant: { descriptor: "merchant", country: "GB", category: "5000" },
											operations: [
												{
													type: "capture",
													reference: "aaaaaaaa",
													amount: {
														account: { value: 50, currency: "GBP" },
														merchant: { value: 50, currency: "GBP" },
														rate: 1,
													},
													status: "success",
													modified: "2024-04-26T02:00:02.000Z",
													created: "2024-04-26T02:00:02.000Z",
												},
											],
											status: "finalized",
											amount: { value: 50, currency: "GBP" },
											modified: "2024-04-26T02:00:02.000Z",
											created: "2024-04-26T02:00:02.000Z",
										},
									],
								},
								{
									purpose: "Hat",
									payment: {
										type: "card",
										limit: { value: 15, currency: "GBP", interval: "single", created: "2024-04-22" },
										rates: { EUR: 1.1620947920721894 },
										reference: "modulr|V500014TS4",
										mask: "500184******3096",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "yyLB9lB9",
									type: "purchase",
									email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
									created: "2024-04-24T09:05:31.860Z",
									modified: "2024-04-29T12:32:59.220Z",
									receipts: [],
									transactions: [],
								},
							],
							type: "delegation",
						},
					],
					type: "delegation",
				},
			],
			type: "costCenter",
		}
		expect(proquse.CostCenter.validate(original)).toEqual({ status: true })
		expect(proquse.CostCenter.validate(change)).toEqual({
			status: false,
			reason: "overallocated",
			origin: change.usage[0].usage[1],
		})
	})
})

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
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(true)
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01", spent: true })).toEqual(true)
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01", limit: 400, currency: "USD" })).toEqual(false)
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01", limit: 600, currency: "EUR" })).toEqual(false)
		const oldCostCenter = costCenter.usage[0]
		if (!proquse.CostCenter.is(oldCostCenter)) {
			expect(proquse.CostCenter.is(oldCostCenter)).toEqual(true)
			return
		}
		proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			amount: { interval: "year", value: 700, currency: "USD", created: "2023-01-01" },
		})

		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)
		proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			amount: { interval: "year", value: 200, currency: "USD", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)
		proquse.CostCenter.change([costCenter], {
			...oldCostCenter,
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(true)

		const oldDelegation = oldCostCenter.usage[0]
		if (!proquse.Delegation.is(oldDelegation)) {
			expect(proquse.Delegation.is(oldDelegation)).toEqual(true)
			return
		}

		proquse.Delegation.change([costCenter], {
			...oldDelegation,
			amount: { interval: "year", value: 600, currency: "USD", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)

		proquse.Delegation.change([costCenter], {
			...oldDelegation,
			amount: { interval: "year", value: 400, currency: "EUR", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)

		proquse.Delegation.change([costCenter], {
			...oldDelegation,
			amount: { interval: "year", value: 200, currency: "USD", created: "2023-01-01" },
		})
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(true)

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
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-06-01" })).toEqual(true)
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
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(true)

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
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(true)

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
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(true)
		costCenter.usage[0].amount.value = 101
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(false)

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
		expect(proquse.CostCenter.validate(costCenter, { date: "2023-03-15" })).toEqual(false)

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
		expect(proquse.CostCenter.validate(costCenter)).toEqual(true)
	})
})

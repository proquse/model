import { isoly } from "isoly"
import { issuefab } from "../index"

describe("CostCenter", () => {
	it("exports", () => {
		expect(typeof issuefab.CostCenter.is).toEqual("function")
		expect(typeof issuefab.CostCenter.change).toEqual("function")
		expect(typeof issuefab.CostCenter.create).toEqual("function")
		expect(typeof issuefab.CostCenter.find).toEqual("function")
		expect(typeof issuefab.CostCenter.remove).toEqual("function")
		expect(typeof issuefab.CostCenter.validate).toEqual("function")
		expect(issuefab.CostCenter.findUser).toEqual(issuefab.Delegation.findUser)
		expect(issuefab.CostCenter.findParent).toEqual(issuefab.Delegation.findParent)
		expect(issuefab.CostCenter.findParents).toEqual(issuefab.Delegation.findParents)
		expect(issuefab.CostCenter.path).toEqual(issuefab.Delegation.path)
		expect(issuefab.CostCenter.allocated).toEqual(issuefab.Delegation.allocated)
		expect(issuefab.CostCenter.spent).toEqual(issuefab.Delegation.spent)
	})
	it("is", () => {
		const costCenter: issuefab.CostCenter = {
			id: "11111111",
			amount: { interval: "year", value: 10, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [],
			costCenters: [],
		}
		expect(issuefab.CostCenter.is(costCenter)).toEqual(true)
		expect(issuefab.CostCenter.is({ ...costCenter, to: [] })).toEqual(true)
		expect(issuefab.CostCenter.type.get({ ...costCenter, to: ["james@issuefab.com"] })).toEqual(costCenter)
		expect(issuefab.CostCenter.is((({ id, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ amount, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ name, ...rest }) => rest)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ created, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ modified, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ from, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ description, ...costCenter }) => costCenter)(costCenter))).toEqual(true)
		expect(issuefab.CostCenter.is((({ delegations, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ costCenters, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
	})
	it("change", () => {
		const costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [
						{
							id: "d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2021-12-20T13:37:42Z",
							modified: "2022-12-20T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							delegations: [],
							purchases: [],
						},
					],
					costCenters: [],
				},
			],
		}
		let result = issuefab.CostCenter.change([costCenter], {
			...costCenter,
			amount: { interval: "year", value: 600, currency: "USD", created: "2023-01-01" },
		})
		expect(result?.root).toBe(costCenter)
		expect(result?.root).toBe(result?.changed)
		expect(result?.root?.amount.value).toEqual(600)
		result = issuefab.CostCenter.change([costCenter], {
			...costCenter.costCenters[0],
			name: "NewName",
		})
		expect(result?.root).toBe(costCenter)
		expect(result?.root).not.toBe(result?.changed)
		expect(result?.changed).toBe(costCenter.costCenters[0])
		expect(costCenter.name).toEqual("Development")
		expect(costCenter.costCenters[0].name).toEqual("NewName")
		expect(costCenter.costCenters[0].delegations[0].costCenter).toEqual("NewName")
		expect(costCenter.costCenters[0].delegations[0].costCenter).not.toEqual("RandomName")
	})
	it("create", () => {
		const creatable: issuefab.CostCenter.Creatable = {
			amount: { interval: "year", value: 1_600, currency: "USD", created: "2023-01-01" },
			from: "jessie@example.com",
			description: "buy things",
			name: "fun",
		}
		expect(issuefab.CostCenter.is(issuefab.CostCenter.create(creatable))).toEqual(true)
		expect(issuefab.CostCenter.create(creatable, { id: "d4" }).id).toEqual("d4")
		expect(issuefab.CostCenter.create(creatable, { from: "james@issuefab.com" }).from).toEqual("james@issuefab.com")
		expect(issuefab.CostCenter.is(issuefab.CostCenter.create(creatable, { from: undefined }))).toEqual(false)
	})
	it("find", () => {
		const costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [
						{
							id: "d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2021-12-20T13:37:42Z",
							modified: "2022-12-20T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							delegations: [],
							purchases: [],
						},
					],
					costCenters: [],
				},
			],
		}
		let result:
			| {
					root: issuefab.CostCenter | issuefab.Delegation | undefined
					found: issuefab.CostCenter | issuefab.Delegation | undefined
			  }
			| undefined
		result = issuefab.CostCenter.find([costCenter], "c2")
		expect(result?.root).toBe(costCenter)
		expect(result?.found).toBe(costCenter.costCenters[0])
		result = issuefab.CostCenter.find([costCenter], "c1")
		expect(result?.root).toBe(costCenter)
		expect(result?.found).toBe(costCenter)
		result = issuefab.CostCenter.find([costCenter], "d1")
		expect(result).toEqual(undefined)
		result = issuefab.CostCenter.find.node([costCenter], "d1")
		expect(result?.root).toBe(costCenter)
		expect(result?.found).toBe(costCenter.costCenters[0].delegations[0])
		result = issuefab.CostCenter.find.node([costCenter], "d2")
		expect(result).toEqual(undefined)
	})
	it("remove", () => {
		const costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [
						{
							id: "d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2021-12-20T13:37:42Z",
							modified: "2022-12-20T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							delegations: [],
							purchases: [],
						},
					],
					costCenters: [],
				},
			],
		}
		let result = issuefab.CostCenter.remove([costCenter], "d1")
		expect(result).toEqual(undefined)
		result = issuefab.CostCenter.remove([costCenter], "c2")
		expect(result?.root).toBe(costCenter)
		expect(result?.removed.id).toEqual("c2")
		expect(costCenter.costCenters.length).toEqual(0)
		result = issuefab.CostCenter.remove([costCenter], "c1")
		const costCenters = [costCenter]
		result = issuefab.CostCenter.remove(costCenters, "c1")
		expect(result?.root).toBe(result?.removed)
		expect(result?.root).toBe(costCenter)
		expect(result?.removed.id).toEqual("c1")
		expect(costCenters.length).toEqual(0)
	})
	it("validate", () => {
		let costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "year", value: 400, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [
						{
							id: "d1",
							amount: { interval: "year", value: 300, currency: "USD", created: "2023-01-01" },
							costCenter: "Development",
							created: "2023-01-01T13:37:42Z",
							modified: "2024-01-01T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							delegations: [],
							purchases: [],
						},
					],
					costCenters: [],
				},
			],
		}
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(true)
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01", spent: true })).toEqual(true)
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01", limit: 400, currency: "USD" })).toEqual(false)
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01", limit: 600, currency: "EUR" })).toEqual(false)
		issuefab.CostCenter.change([costCenter], {
			...costCenter.costCenters[0],
			amount: { interval: "year", value: 700, currency: "USD", created: "2023-01-01" },
		})
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)
		issuefab.CostCenter.change([costCenter], {
			...costCenter.costCenters[0],
			amount: { interval: "year", value: 200, currency: "USD", created: "2023-01-01" },
		})
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)
		issuefab.CostCenter.change([costCenter], {
			...costCenter.costCenters[0],
			amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
		})
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(true)
		issuefab.Delegation.change([costCenter], {
			...costCenter.costCenters[0].delegations[0],
			amount: { interval: "year", value: 600, currency: "USD", created: "2023-01-01" },
		})
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)
		issuefab.Delegation.change([costCenter], {
			...costCenter.costCenters[0].delegations[0],
			amount: { interval: "year", value: 400, currency: "EUR", created: "2023-01-01" },
		})
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(false)
		issuefab.Delegation.change([costCenter], {
			...costCenter.costCenters[0].delegations[0],
			amount: { interval: "year", value: 200, currency: "USD", created: "2023-01-01" },
		})
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-01-01" })).toEqual(true)

		// running out of resources early is ok
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [
				{
					id: "d1",
					amount: { interval: "month", value: 100, currency: "USD", created: "2023-03-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					delegations: [],
					purchases: [],
				},
			],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "month", value: 400, currency: "USD", created: "2023-02-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [],
					costCenters: [],
				},
			],
		}
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-06-01" })).toEqual(true)
		expect(
			isoly.Date.next(
				isoly.DateTime.getDate(costCenter.created),
				issuefab.Cadence.sustainable(
					costCenter.amount,
					[costCenter.delegations[0].amount, costCenter.costCenters[0].amount],
					"2023-12-31"
				)
			)
		).not.toEqual("2023-12-31")
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(true)

		// running out of resources on day 0 is ok
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [
				{
					id: "d1",
					amount: { interval: "month", value: 100, currency: "USD", created: "2023-01-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					delegations: [],
					purchases: [],
				},
			],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "month", value: 300, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [],
					costCenters: [],
				},
			],
		}
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(true)

		// running out of resources before day 0 is not ok
		costCenter = {
			id: "c1",
			amount: { interval: "month", value: 400, currency: "USD", created: "2023-01-01" },
			name: "Development",
			created: "2023-01-01T13:37:42Z",
			modified: "2024-01-01T13:37:42Z",
			from: "jessie@example.com",
			description: "description",
			delegations: [
				{
					id: "d1",
					amount: { interval: "month", value: 100, currency: "USD", created: "2023-01-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					delegations: [],
					purchases: [],
				},
			],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "month", value: 300, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [],
					costCenters: [],
				},
			],
		}
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(true)
		costCenter.delegations[0].amount.value = 101
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-12-01" })).toEqual(false)

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
			delegations: [
				{
					id: "d1",
					amount: { interval: "month", value: 200, currency: "USD", created: "2023-02-01" },
					costCenter: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					purpose: "Software services",
					to: ["james@example.com"],
					purchases: [],
					delegations: [
						{
							id: "d2",
							amount: { interval: "single", value: 300, currency: "USD", created: "2023-03-15" },
							costCenter: "Development",
							created: "2023-01-01T13:37:42Z",
							modified: "2024-01-01T13:37:42Z",
							from: "jessie@example.com",
							purpose: "Software services",
							to: ["james@example.com"],
							delegations: [],
							purchases: [],
						},
					],
				},
			],
			costCenters: [
				{
					id: "c2",
					amount: { interval: "month", value: 300, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2023-01-01T13:37:42Z",
					modified: "2024-01-01T13:37:42Z",
					from: "jessie@example.com",
					description: "better description",
					delegations: [],
					costCenters: [],
				},
			],
		}
		expect(issuefab.CostCenter.validate(costCenter, { date: "2023-03-15" })).toEqual(false)
	})
})

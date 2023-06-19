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
		expect(issuefab.CostCenter.balance).toEqual(issuefab.Delegation.balance)
		expect(issuefab.CostCenter.spent).toEqual(issuefab.Delegation.spent)
	})
	it("is", () => {
		const costCenter: issuefab.CostCenter = {
			id: "1",
			amount: [10, "USD"],
			costCenter: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			purpose: "description",
			delegations: [],
			costCenters: [],
		}
		expect(issuefab.CostCenter.is(costCenter)).toEqual(true)
		expect(issuefab.CostCenter.is({ ...costCenter, to: [] })).toEqual(true)
		expect(issuefab.CostCenter.is({ ...costCenter, to: ["james@issuefab.com"] })).toEqual(false)
		expect(issuefab.CostCenter.is((({ id, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ amount, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ costCenter, ...rest }) => rest)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ created, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ modified, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ from, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ purpose, ...costCenter }) => costCenter)(costCenter))).toEqual(true)
		expect(issuefab.CostCenter.is((({ delegations, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
		expect(issuefab.CostCenter.is((({ costCenters, ...costCenter }) => costCenter)(costCenter))).toEqual(false)
	})
	it("change", () => {
		const costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: [10, "USD"],
			costCenter: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			purpose: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: [4, "USD"],
					costCenter: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					purpose: "better description",
					delegations: [
						{
							id: "d1",
							amount: [3, "USD"],
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
		let result = issuefab.CostCenter.change([costCenter], { ...costCenter, amount: [11, "USD"] })
		expect(result?.root).toBe(costCenter)
		expect(result?.root).toBe(result?.changed)
		expect(result?.root?.amount).toEqual([11, "USD"])
		result = issuefab.CostCenter.change([costCenter], { ...costCenter.costCenters[0], costCenter: "development" })
		expect(result?.root).toBe(costCenter)
		expect(result?.root).not.toBe(result?.changed)
		expect(result?.changed).toBe(costCenter.costCenters[0])
		expect(costCenter.costCenter).toEqual("development")
		expect(costCenter.costCenters[0].costCenter).toEqual("development")
		expect(costCenter.costCenters[0].delegations[0].costCenter).toEqual("development")
	})
	it("create", () => {
		const creatable: issuefab.CostCenter.Creatable = {
			amount: [16, "USD"],
			from: "jessie@example.com",
			purpose: "buy things",
			costCenter: "fun",
		}

		expect(issuefab.CostCenter.is(issuefab.CostCenter.create(creatable))).toEqual(true)
		expect(issuefab.CostCenter.create(creatable, { id: "d4" }).id).toEqual("d4")
		expect(issuefab.CostCenter.create(creatable, { from: "james@issuefab.com" }).from).toEqual("james@issuefab.com")
		expect(issuefab.CostCenter.is(issuefab.CostCenter.create(creatable, { from: undefined }))).toEqual(false)
	})
	it("find", () => {
		const costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: [10, "USD"],
			costCenter: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			purpose: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: [4, "USD"],
					costCenter: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					purpose: "better description",
					delegations: [
						{
							id: "d1",
							amount: [3, "USD"],
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
			amount: [10, "USD"],
			costCenter: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			purpose: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: [4, "USD"],
					costCenter: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					purpose: "better description",
					delegations: [
						{
							id: "d1",
							amount: [3, "USD"],
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
		const costCenter: issuefab.CostCenter = {
			id: "c1",
			amount: [10, "USD"],
			costCenter: "Development",
			created: "2021-12-20T13:37:42Z",
			modified: "2022-12-20T13:37:42Z",
			from: "jessie@example.com",
			purpose: "description",
			delegations: [],
			costCenters: [
				{
					id: "c2",
					amount: [4, "USD"],
					costCenter: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					purpose: "better description",
					delegations: [
						{
							id: "d1",
							amount: [3, "USD"],
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
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(true)
		expect(issuefab.CostCenter.validate(costCenter, [5, "USD"])).toEqual(false)
		expect(issuefab.CostCenter.validate(costCenter, [20, "EUR"])).toEqual(false)
		issuefab.CostCenter.change([costCenter], { ...costCenter.costCenters[0], amount: [15, "USD"] })
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(false)
		issuefab.CostCenter.change([costCenter], { ...costCenter.costCenters[0], amount: [4, "EUR"] })
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(false)
		issuefab.CostCenter.change([costCenter], { ...costCenter.costCenters[0], amount: [10, "USD"] })
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(true)
		issuefab.Delegation.change([costCenter], { ...costCenter.costCenters[0].delegations[0], amount: [11, "USD"] })
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(false)
		issuefab.Delegation.change([costCenter], { ...costCenter.costCenters[0].delegations[0], amount: [4, "EUR"] })
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(false)
		issuefab.Delegation.change([costCenter], { ...costCenter.costCenters[0].delegations[0], amount: [4, "USD"] })
		expect(issuefab.CostCenter.validate(costCenter)).toEqual(true)
	})
})

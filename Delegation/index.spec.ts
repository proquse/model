import * as model from "../index"

describe("Delegation", () => {
	const initialDelegation: model.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: [],
		purpose: "Total company Budget",
		amount: [0, "EUR"],
		delegations: [],
		purchases: [],
	}
	const topLevelDelegation: model.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: [],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						from: "mary@example.com",
						purpose: "Cloudflare",
						amount: [120, "EUR"],
						delegations: [
							{
								id: "abcd0003",
								created: "2021-12-28T13:37:42Z",
								modified: "2021-12-28T13:37:42Z",
								to: ["john@example.com"],
								costCenter: "IT",
								from: "mary@example.com",
								purpose: "Cloudflare",
								amount: [1, "EUR"],
								delegations: [],
								purchases: [],
							},
						],
						purchases: [
							{
								id: "aoeu1234",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [9.5, "EUR"],
								purpose: "Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [
									{
										id: "id",
										amount: [10, "USD"],
										date: "2022-01-01T00:00:42Z",
										vat: 0,
										original: "https://example.com/receipt.pdf",
									},
								],
								transactions: [],
							},
							{
								id: "aoeu1234",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [],
								transactions: [],
							},
						],
					},
				],
				purchases: [
					{
						id: "aoeu2345",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						amount: [9.5, "EUR"],
						purpose: "Production Workers",
						payment: { type: "card", limit: [10, "EUR"] },
						receipts: [
							{
								id: "id",
								amount: [10, "USD"],
								date: "2022-01-01T00:00:42Z",
								vat: 0,
								original: "https://example.com/receipt.pdf",
							},
						],
						transactions: [],
					},
				],
			},
			{
				id: "abcd0004",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
								purpose: "Partial company budget",
								amount: [1000, "EUR"],
								delegations: [],
								purchases: [],
							},
						],
						purchases: [],
					},
				],
				purchases: [],
			},
		],
		purchases: [],
	}

	it("is", () => {
		expect(model.Delegation.is(initialDelegation)).toEqual(true)
		expect(model.Delegation.is(topLevelDelegation)).toEqual(true)
	})

	it("findUser", () => {
		expect(model.Delegation.findUser([topLevelDelegation], "john@example.com")).toEqual([
			topLevelDelegation.delegations[0].delegations[0].delegations[0],
			topLevelDelegation.delegations[1].delegations[0],
		])
		expect(new Set(model.Delegation.findUser([topLevelDelegation], "richard@example.com"))).toEqual(
			new Set([topLevelDelegation.delegations[1], topLevelDelegation.delegations[0].delegations[0]])
		)
	})
	it("find", () => {
		expect(model.Delegation.find([topLevelDelegation], "abcd0001")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation,
		})
		expect(model.Delegation.find([topLevelDelegation], "abcd0002")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation.delegations[0],
		})
		expect(model.Delegation.find([topLevelDelegation], "abcd0005")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation.delegations[1].delegations[0],
		})
	})
	it("findParent", () => {
		expect(model.Delegation.findParent([topLevelDelegation], topLevelDelegation.delegations[0].id)).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation,
		})
		expect(model.Delegation.findParent([topLevelDelegation.delegations[1]], "abcd0006")).toEqual({
			root: topLevelDelegation.delegations[1],
			found: topLevelDelegation.delegations[1].delegations[0],
		})
		expect(model.Delegation.findParent([topLevelDelegation.delegations[0]], "abcd0006")).toEqual(undefined)
	})
	it("change", () => {
		let before: model.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		let updated: model.Delegation = {
			id: "abcd0002",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [3000, "EUR"],
			delegations: [],
			purchases: [],
		}
		let after: model.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [{ ...updated }],
			purchases: [],
		}
		let result = model.Delegation.change([before], updated)
		expect(before).toEqual(after)
		expect(result).toEqual({ root: before, changed: updated })
		const final = { ...before, to: ["jane@example.com"] }
		result = model.Delegation.change([before], final)
		expect(before).toEqual(final)
		expect(result).toEqual({ root: before, changed: final })

		before = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		updated = {
			id: "abcd0002",
			from: "jane@example.com",
			costCenter: "changed",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [3000, "EUR"],
			delegations: [],
			purchases: [],
		}
		after = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "changed",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [{ ...updated }],
			purchases: [],
		}
		result = model.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
		updated = { ...updated, id: "abcd0001" }
		after = { ...updated }
		result = model.Delegation.change([before], updated)
		expect(result).toEqual({ root: after, changed: after })
	})
	it("remove", () => {
		const toBeRemoved: model.Delegation = {
			id: "abcd0003",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [2000, "EUR"],
			delegations: [],
			purchases: [],
		}
		const after: model.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		const before: model.Delegation = {
			...after,
			delegations: [...after.delegations, toBeRemoved],
		}
		expect(model.Delegation.remove([before], toBeRemoved.id)).toEqual({ root: before, removed: toBeRemoved })
		expect(before).toEqual(after)
		expect(model.Delegation.remove([before], before.id)).toEqual({ root: before, removed: before })
		expect(model.Delegation.remove([after], "xyz")).toEqual(undefined)
	})
	it("spent", () => {
		expect(model.Delegation.spent(topLevelDelegation)).toEqual(29)
		expect(model.Delegation.spent(topLevelDelegation.delegations[1])).toEqual(0)
		expect(model.Delegation.spent(topLevelDelegation.delegations[0])).toEqual(19.5)
		expect(model.Delegation.spent(topLevelDelegation, true)).toEqual(29)
		expect(model.Delegation.spent(topLevelDelegation.delegations[0].delegations[0], true)).toEqual(19.5)
		expect(model.Delegation.spent(topLevelDelegation.delegations[0], true)).toEqual(29)
	})
	it("balance", () => {
		expect(model.Delegation.balance(topLevelDelegation)).toEqual(16000)
		expect(model.Delegation.balance(topLevelDelegation.delegations[1].delegations[0].delegations[0])).toEqual(1000)
	})
	it("create", () => {
		expect(
			model.Delegation.is(model.Delegation.create(model.Delegation.Creatable.create(), "mary@example.com"))
		).toEqual(true)
	})
	it("findParents", () => {
		expect(model.Delegation.findParents([topLevelDelegation], "abcd0003")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[0],
		])
		expect(model.Delegation.findParents([topLevelDelegation], "abcd0001")).toEqual([])
		expect(model.Delegation.findParents([topLevelDelegation], "abcd0006")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[1],
			topLevelDelegation.delegations[1].delegations[0],
		])
		expect(model.Delegation.findParents([topLevelDelegation], "abcd0002")).toEqual([topLevelDelegation])
		expect(model.Delegation.findParents([topLevelDelegation], "xyz")).toEqual(undefined)
	})
	it("path", () => {
		expect(model.Delegation.path([topLevelDelegation], "abcd0001")).toEqual([topLevelDelegation])
		expect(model.Delegation.path([topLevelDelegation], "abcd0003")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[0],
			topLevelDelegation.delegations[0].delegations[0],
		])
		expect(model.Delegation.path([topLevelDelegation], "abcd0006")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[1],
			topLevelDelegation.delegations[1].delegations[0],
			topLevelDelegation.delegations[1].delegations[0].delegations[0],
		])
	})
	it("validate", () => {
		const testFrom: model.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					costCenter: "IT",
					from: "",
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		const testCostCenter: model.Delegation = {
			id: "abcd0001",
			from: "",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: [],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					costCenter: "",
					from: "John@example.com",
					purpose: "Partial company Budget",
					amount: [2000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		expect(model.Delegation.validate(topLevelDelegation, undefined, true)).toEqual(true)
		expect(model.Delegation.validate(initialDelegation, undefined, true)).toEqual(true)
		expect(model.Delegation.validate(testFrom)).toEqual(false)
		expect(model.Delegation.validate(testCostCenter, undefined, true)).toEqual(false)
	})
})

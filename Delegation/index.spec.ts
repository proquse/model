import { issuefab } from "../index"

describe("Delegation", () => {
	const initialDelegation: issuefab.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["jessie@example.com"],
		purpose: "Total company Budget",
		amount: [100_000, "EUR"],
		delegations: [],
		purchases: [],
	}
	const topLevelDelegation: issuefab.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["jessie@example.com"],
		purpose: "Total company Budget",
		amount: [20_000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: [2_000, "EUR"],
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
										total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],

										date: "2022-01-01T00:00:42Z",

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
								total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
								date: "2022-01-01T00:00:42Z",
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
				amount: [2_000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: [1_000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
								purpose: "Partial company budget",
								amount: [1_000, "EUR"],
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
		expect(issuefab.Delegation.is(initialDelegation)).toEqual(true)
		expect(issuefab.Delegation.is(topLevelDelegation)).toEqual(true)
		expect(issuefab.Delegation.is({ ...initialDelegation, to: [] })).toEqual(false)
	})

	it("findUser", () => {
		expect(issuefab.Delegation.findUser([topLevelDelegation], "john@example.com")).toEqual([
			topLevelDelegation.delegations[0].delegations[0].delegations[0],
			topLevelDelegation.delegations[1].delegations[0],
		])
		expect(new Set(issuefab.Delegation.findUser([topLevelDelegation], "richard@example.com"))).toEqual(
			new Set([topLevelDelegation.delegations[1], topLevelDelegation.delegations[0].delegations[0]])
		)
	})
	it("find", () => {
		expect(issuefab.Delegation.find([topLevelDelegation], "abcd0001")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation,
		})
		expect(issuefab.Delegation.find([topLevelDelegation], "abcd0002")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation.delegations[0],
		})
		expect(issuefab.Delegation.find([topLevelDelegation], "abcd0005")).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation.delegations[1].delegations[0],
		})
	})
	it("findParent", () => {
		expect(issuefab.Delegation.findParent([topLevelDelegation], topLevelDelegation.delegations[0].id)).toEqual({
			root: topLevelDelegation,
			found: topLevelDelegation,
		})
		expect(issuefab.Delegation.findParent([topLevelDelegation.delegations[1]], "abcd0006")).toEqual({
			root: topLevelDelegation.delegations[1],
			found: topLevelDelegation.delegations[1].delegations[0],
		})
		expect(issuefab.Delegation.findParent([topLevelDelegation.delegations[0]], "abcd0006")).toEqual(undefined)
	})
	it("change", () => {
		let before: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20_000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2_000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		let updated: issuefab.Delegation = {
			id: "abcd0002",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [3_000, "EUR"],
			delegations: [],
			purchases: [],
		}
		let after: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20_000, "EUR"],
			delegations: [{ ...updated }],
			purchases: [],
		}
		let result = issuefab.Delegation.change([before], updated)
		expect(before).toEqual(after)
		expect(result).toEqual({ root: before, changed: updated })
		const final = { ...before, to: ["jane@example.com"] }
		result = issuefab.Delegation.change([before], final)
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
			amount: [20_000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2_000, "EUR"],
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
			amount: [3_000, "EUR"],
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
			amount: [20_000, "EUR"],
			delegations: [{ ...updated }],
			purchases: [],
		}
		result = issuefab.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
		updated = { ...updated, id: "abcd0001" }
		after = { ...updated }
		result = issuefab.Delegation.change([before], updated)
		expect(result).toEqual({ root: after, changed: after })
	})
	it("remove", () => {
		const toBeRemoved: issuefab.Delegation = {
			id: "abcd0003",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: [2_000, "EUR"],
			delegations: [],
			purchases: [],
		}
		const after: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20_000, "EUR"],
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2021-12-20T13:37:42Z",
					modified: "2021-12-20T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: [2_000, "EUR"],
					delegations: [],
					purchases: [],
				},
			],
			purchases: [],
		}
		const before: issuefab.Delegation = {
			...after,
			delegations: [...after.delegations, toBeRemoved],
		}
		expect(issuefab.Delegation.remove([before], toBeRemoved.id)).toEqual({ root: before, removed: toBeRemoved })
		expect(before).toEqual(after)
		expect(issuefab.Delegation.remove([before], before.id)).toEqual({ root: before, removed: before })
		expect(issuefab.Delegation.remove([after], "xyz")).toEqual(undefined)
	})
	it("spent", () => {
		expect(issuefab.Delegation.spent(topLevelDelegation)).toEqual(29)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[1])).toEqual(0)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[0])).toEqual(19.5)
		expect(issuefab.Delegation.spent(topLevelDelegation, true)).toEqual(29)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[0].delegations[0], true)).toEqual(19.5)
		expect(issuefab.Delegation.spent(topLevelDelegation.delegations[0], true)).toEqual(29)
	})
	it("balance", () => {
		expect(issuefab.Delegation.balance(topLevelDelegation)).toEqual(16000)
		expect(issuefab.Delegation.balance(topLevelDelegation.delegations[1].delegations[0].delegations[0])).toEqual(1000)
	})
	it("create", () => {
		expect(
			issuefab.Delegation.is(
				issuefab.Delegation.create({
					to: ["james@example.com"],
					amount: [123, "EUR"],
					costCenter: "gear",
					from: "jessie@example.com",
					purpose: "Money!",
				})
			)
		).toEqual(true)
	})
	it("findParents", () => {
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0003")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[0],
		])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0001")).toEqual([])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0006")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[1],
			topLevelDelegation.delegations[1].delegations[0],
		])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "abcd0002")).toEqual([topLevelDelegation])
		expect(issuefab.Delegation.findParents([topLevelDelegation], "xyz")).toEqual(undefined)
	})
	it("path", () => {
		expect(issuefab.Delegation.path([topLevelDelegation], "abcd0001")).toEqual([topLevelDelegation])
		expect(issuefab.Delegation.path([topLevelDelegation], "abcd0003")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[0],
			topLevelDelegation.delegations[0].delegations[0],
		])
		expect(issuefab.Delegation.path([topLevelDelegation], "abcd0006")).toEqual([
			topLevelDelegation,
			topLevelDelegation.delegations[1],
			topLevelDelegation.delegations[1].delegations[0],
			topLevelDelegation.delegations[1].delegations[0].delegations[0],
		])
	})
	it("validate", () => {
		const testFrom: issuefab.Delegation = {
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
		const testCostCenter: issuefab.Delegation = {
			id: "abcd0001",
			from: "",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["jessie@example.com"],
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
		expect(issuefab.Delegation.validate(topLevelDelegation, undefined)).toEqual(true)
		expect(issuefab.Delegation.validate(initialDelegation, undefined)).toEqual(true)
		expect(issuefab.Delegation.validate(testFrom)).toEqual(false)
		expect(issuefab.Delegation.validate(testCostCenter, undefined)).toEqual(false)
	})
})

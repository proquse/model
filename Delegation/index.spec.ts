import { issuefab } from "../index"

describe("Delegation", () => {
	const initialDelegation: issuefab.Delegation = {
		id: "---d1---",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2023-01-01T13:37:42Z",
		modified: "2023-01-01T13:37:42Z",
		to: ["jessie@example.com"],
		purpose: "Total company Budget",
		amount: { interval: "year", value: 100_000, currency: "EUR", created: "2023-01-01" },
		delegations: [],
		purchases: [],
	}
	const costCenter: issuefab.CostCenter = {
		id: "c1",
		from: "jane@example.com",
		name: "budget",
		created: "2023-01-01T13:37:42Z",
		modified: "2023-01-01T13:37:42Z",
		description: "Total company Budget",
		amount: { interval: "year", value: 20_000, currency: "EUR", created: "2023-01-01" },
		delegations: [
			{
				id: "d1",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				delegations: [
					{
						id: "d2",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						from: "mary@example.com",
						purpose: "Cloudflare",
						amount: { interval: "year", value: 1_200, currency: "EUR", created: "2023-01-01" },
						delegations: [
							{
								id: "d3",
								created: "2021-12-28T13:37:42Z",
								modified: "2021-12-28T13:37:42Z",
								to: ["john@example.com"],
								costCenter: "IT",
								from: "mary@example.com",
								purpose: "Cloudflare",
								amount: { interval: "year", value: 100, currency: "EUR", created: "2023-01-01" },
								delegations: [],
								purchases: [],
							},
						],
						purchases: [
							{
								id: "p1",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: { interval: "month", value: 15, currency: "EUR", created: "2023-01-01" },
								},
								receipts: [
									{
										id: "r1",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-01-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r2",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-02-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r3",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-03-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r4",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-04-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r5",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-05-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r6",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-06-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r7",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-07-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r8",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-08-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r9",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-09-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r10",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-10-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r11",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-11-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r12",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-12-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
							},
							{
								id: "p2",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: { interval: "month", value: 30, currency: "EUR", created: "2023-01-01" },
								},
								receipts: [],
							},
						],
					},
				],
				purchases: [
					{
						id: "p3",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						purpose: "Production Workers",
						payment: { type: "card", limit: { interval: "month", value: 300, currency: "EUR", created: "2023-11-15" } },
						receipts: [
							{
								id: "r13",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
							{
								id: "r14",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
					},
				],
			},
			{
				id: "d4",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "Cloudflare",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				delegations: [
					{
						id: "d5",
						created: "2023-01-01T13:37:42Z",
						modified: "2023-01-01T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: { interval: "year", value: 1_000, currency: "EUR", created: "2023-01-01" },
						delegations: [
							{
								id: "d6",
								created: "2023-01-01T13:37:42Z",
								modified: "2023-01-01T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
								purpose: "Partial company budget",
								amount: { interval: "month", value: 100, currency: "EUR", created: "2023-03-01" },
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
		costCenters: [
			{
				id: "c2",
				from: "jane@example.com",
				name: "partial budget",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				description: "Partial company budget",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				costCenters: [],
				delegations: [],
			},
		],
	}

	it("is", () => {
		expect(issuefab.Delegation.is(initialDelegation)).toEqual(true)
		expect(issuefab.Delegation.is((({ from, ...delegation }) => delegation)(initialDelegation))).toEqual(false)
		expect(issuefab.Delegation.is({ ...initialDelegation, to: [] })).toEqual(false)
		expect(issuefab.Delegation.is(costCenter)).toEqual(false)
	})

	it("findUser", () => {
		expect(issuefab.Delegation.findUser([costCenter], "john@example.com")).toEqual([
			costCenter.delegations[0].delegations[0].delegations[0],
			costCenter.delegations[1].delegations[0],
		])
		expect(new Set(issuefab.Delegation.findUser([costCenter], "richard@example.com"))).toEqual(
			new Set([costCenter.delegations[1], costCenter.delegations[0].delegations[0]])
		)
	})
	it("find", () => {
		expect(issuefab.CostCenter.find([costCenter], "c1")).toEqual({
			root: costCenter,
			found: costCenter,
		})
		expect(issuefab.Delegation.find([costCenter], "d1")).toEqual({
			root: costCenter,
			found: costCenter.delegations[0],
		})
		expect(issuefab.Delegation.find([costCenter], "d5")).toEqual({
			root: costCenter,
			found: costCenter.delegations[1].delegations[0],
		})
		expect(issuefab.Delegation.find([costCenter], "abcd0001")).toEqual(undefined)
		expect(issuefab.Delegation.find.node([costCenter], "c1")).toEqual({
			root: costCenter,
			found: costCenter,
		})
	})
	it("findParent", () => {
		expect(issuefab.Delegation.findParent([costCenter], costCenter.delegations[0].id)).toEqual({
			root: costCenter,
			found: costCenter,
		})
		expect(issuefab.Delegation.findParent([costCenter.delegations[1]], "d6")).toEqual({
			root: costCenter.delegations[1],
			found: costCenter.delegations[1].delegations[0],
		})
		expect(issuefab.Delegation.findParent([costCenter.delegations[0]], "d6")).toEqual(undefined)
	})
	it("change", () => {
		let before: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2023-01-01T13:37:42Z",
					modified: "2023-01-01T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
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
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: { interval: "single", value: 3_000, currency: "EUR", created: "2023-01-01" },
			delegations: [],
			purchases: [],
		}
		let after: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
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
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2023-01-01T13:37:42Z",
					modified: "2023-01-01T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
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
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: { interval: "single", value: 3_000, currency: "EUR", created: "2023-01-01" },
			delegations: [],
			purchases: [],
		}
		after = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "changed",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			delegations: [{ ...updated }],
			purchases: [],
		}
		result = issuefab.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
		updated = { ...updated, id: "abcd0001" }
		after = { ...updated }
		result = issuefab.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
	})
	it("remove", () => {
		const toBeRemoved: issuefab.Delegation = {
			id: "abcd0003",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
			delegations: [],
			purchases: [],
		}
		const after: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			delegations: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2023-01-01T13:37:42Z",
					modified: "2023-01-01T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
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
		expect(issuefab.Delegation.spent(costCenter)).toEqual(748)
		expect(issuefab.Delegation.spent(costCenter, { vat: false })).toEqual(718)
		expect(issuefab.Delegation.spent(costCenter.delegations[1])).toEqual(0)
		expect(issuefab.Delegation.spent(costCenter.delegations[0])).toEqual(748)
		expect(issuefab.Delegation.spent(costCenter.delegations[0], { vat: false })).toEqual(718)
		expect(issuefab.Delegation.spent(costCenter.delegations[0].delegations[0], { vat: false })).toEqual(120)
		expect(issuefab.Delegation.spent.balance(costCenter, "2023-12-31")).toEqual(19_252)
		expect(issuefab.Delegation.spent.balance(costCenter, "2023-12-31", { vat: false })).toEqual(19_282)
		expect(issuefab.Delegation.spent.balance(costCenter.delegations[0], "2023-12-31")).toEqual(1_252)
		expect(issuefab.Delegation.spent.balance(costCenter.delegations[0], "2023-12-31", { vat: false })).toEqual(1_282)
	})
	it("allocated", () => {
		expect(issuefab.Delegation.allocated(costCenter, "2023-12-31")).toEqual(6_000)
		expect(issuefab.Delegation.allocated.balance(costCenter, "2023-12-31")).toEqual(14_000)
		expect(
			issuefab.Delegation.allocated.balance(costCenter.delegations[1].delegations[0].delegations[0], "2023-12-31")
		).toEqual(1_000)
	})
	it("create", () => {
		expect(
			issuefab.Delegation.is(
				issuefab.Delegation.create({
					to: ["james@example.com"],
					amount: { interval: "year", value: 100_000, currency: "EUR", created: "2023-01-01" },
					costCenter: "gear",
					from: "jessie@example.com",
					purpose: "Money!",
				})
			)
		).toEqual(true)
	})
	it("findParents", () => {
		expect(issuefab.Delegation.findParents([costCenter], "d2")).toEqual([costCenter, costCenter.delegations[0]])
		expect(issuefab.Delegation.findParents([costCenter], "c1")).toEqual([])
		expect(issuefab.Delegation.findParents([costCenter], "d6")).toEqual([
			costCenter,
			costCenter.delegations[1],
			costCenter.delegations[1].delegations[0],
		])
		expect(issuefab.Delegation.findParents([costCenter], "d1")).toEqual([costCenter])
		expect(issuefab.Delegation.findParents([costCenter], "xyz")).toEqual(undefined)
	})
	it("path", () => {
		expect(issuefab.Delegation.path([costCenter], "c1")).toEqual([costCenter])
		expect(issuefab.Delegation.path([costCenter], "d1")).toEqual([costCenter, costCenter.delegations[0]])
		expect(issuefab.Delegation.path([costCenter], "d2")).toEqual([
			costCenter,
			costCenter.delegations[0],
			costCenter.delegations[0].delegations[0],
		])
		expect(issuefab.Delegation.path([costCenter], "d6")).toEqual([
			costCenter,
			costCenter.delegations[1],
			costCenter.delegations[1].delegations[0],
			costCenter.delegations[1].delegations[0].delegations[0],
		])
	})
	it("validate", () => {
		expect(issuefab.Delegation.validate(initialDelegation, { date: "2023-12-31" })).toEqual(true)
	})
})

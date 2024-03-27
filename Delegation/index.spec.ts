import { isoly } from "isoly"
import { proquse } from "../index"

describe("Delegation", () => {
	const initialDelegation: proquse.Delegation = {
		id: "---d1---",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2023-01-01T13:37:42Z",
		modified: "2023-01-01T13:37:42Z",
		to: ["jessie@example.com"],
		purpose: "Total company Budget",
		amount: { interval: "year", value: 100_000, currency: "EUR", created: "2023-01-01" },
		type: "delegation",
		usage: [],
	}
	const costCenter: proquse.CostCenter = {
		id: "c1------",
		from: "jane@example.com",
		name: "budget",
		created: "2023-01-01T13:37:42Z",
		modified: "2023-01-01T13:37:42Z",
		description: "Total company Budget",
		amount: { interval: "year", value: 20_000, currency: "EUR", created: "2023-01-01" },
		type: "costCenter",
		usage: [
			{
				id: "c1d1----",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "hosting costs",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				type: "delegation",
				usage: [
					{
						id: "c1d1d2--",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						from: "mary@example.com",
						purpose: "Cloudflare",
						amount: { interval: "year", value: 1_200, currency: "EUR", created: "2023-01-01" },
						type: "delegation",
						usage: [
							{
								id: "c1d1d2d3",
								created: "2021-12-28T13:37:42Z",
								modified: "2021-12-28T13:37:42Z",
								to: ["john@example.com"],
								costCenter: "IT",
								from: "mary@example.com",
								purpose: "Cloudflare",
								amount: { interval: "year", value: 100, currency: "EUR", created: "2023-01-01" },
								type: "delegation",
								usage: [],
							},
							{
								id: "c1d1d2p1",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								type: "purchase",
								payment: {
									type: "card",
									limit: { interval: "month", value: 15, currency: "EUR", created: "2023-01-01" },
									mask: "012345******6789",
									expires: { month: 4, year: 24 },
									reference: "reference",
								},
								receipts: [
									{
										id: "r1------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-01-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r2------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-02-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r3------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-03-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r4------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-04-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r5------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-05-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r6------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-06-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r7------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-07-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r8------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-08-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r9------",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-09-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r10-----",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-10-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r11-----",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-11-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
									{
										id: "r12-----",
										total: [{ net: { value: 10, currency: "EUR" }, vat: { value: 2.5, currency: "EUR" } }],
										date: "2023-12-10T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
							},
							{
								id: "c1d1d2p2",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								purpose: "Production Workers",
								type: "purchase",
								payment: {
									type: "card",
									limit: { interval: "month", value: 30, currency: "EUR", created: "2023-01-01" },
									mask: "012345******6789",
									expires: { month: 4, year: 24 },
									reference: "reference",
								},
								receipts: [],
							},
						],
					},
					{
						id: "c1d1p3--",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						purpose: "Production Workers",
						type: "purchase",
						payment: {
							type: "card",
							limit: { interval: "month", value: 300, currency: "EUR", created: "2023-11-15" },
							mask: "012345******6789",
							expires: { month: 4, year: 24 },
							reference: "reference",
						},
						receipts: [
							{
								id: "r13-----",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
							{
								id: "r14-----",
								total: [{ net: { value: 299, currency: "EUR" }, vat: { value: 0, currency: "EUR" } }],
								date: "2022-11-16T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
					},
				],
			},
			{
				id: "c1d4----",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				from: "john@example.com",
				purpose: "Cloudflare",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				type: "delegation",
				usage: [
					{
						id: "c1d4d5--",
						created: "2023-01-01T13:37:42Z",
						modified: "2023-01-01T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						costCenter: "IT",
						from: "richard@example.com",
						purpose: "Partial company budget",
						amount: { interval: "year", value: 1_000, currency: "EUR", created: "2023-01-01" },
						type: "delegation",
						usage: [
							{
								id: "c1d4d5d6",
								created: "2023-01-01T13:37:42Z",
								modified: "2023-01-01T13:37:42Z",
								to: ["mary@example.com"],
								costCenter: "IT",
								from: "john@example.com",
								purpose: "Partial company budget",
								amount: { interval: "month", value: 100, currency: "EUR", created: "2023-03-01" },
								type: "delegation",
								usage: [],
							},
						],
					},
				],
			},

			{
				id: "c1c2----",
				from: "jane@example.com",
				name: "partial budget",
				created: "2023-01-01T13:37:42Z",
				modified: "2023-01-01T13:37:42Z",
				description: "Partial company budget",
				amount: { interval: "year", value: 2_000, currency: "EUR", created: "2023-01-01" },
				type: "costCenter",
				usage: [],
			},
		],
	}

	it("is", () => {
		expect(proquse.Delegation.is(initialDelegation)).toEqual(true)
		expect(proquse.Delegation.is((({ from, ...delegation }) => delegation)(initialDelegation))).toEqual(false)
		expect(proquse.Delegation.is({ ...initialDelegation, to: [] })).toEqual(false)
		expect(proquse.Delegation.is(costCenter)).toEqual(false)
	})

	it("findUser", () => {
		expect(proquse.Delegation.findUser([costCenter], "john@example.com")).toEqual([
			(costCenter.usage[0].usage[0] as proquse.Delegation).usage[0],
			costCenter.usage[1].usage[0],
		])
		expect(new Set(proquse.Delegation.findUser([costCenter], "richard@example.com"))).toEqual(
			new Set([costCenter.usage[1], costCenter.usage[0].usage[0]])
		)
	})
	it("find", () => {
		expect(proquse.CostCenter.find([costCenter], "c1------")).toEqual({
			root: costCenter,
			found: costCenter,
		})
		expect(proquse.Delegation.find([costCenter], "c1d1----")).toEqual({
			root: costCenter,
			found: costCenter.usage[0],
		})
		expect(proquse.Delegation.find([costCenter], "c1d4d5--")).toEqual({
			root: costCenter,
			found: costCenter.usage[1].usage[0],
		})
		expect(proquse.Delegation.find([costCenter], "abcd0001")).toEqual(undefined)
		expect(proquse.Delegation.find.node([costCenter], "c1------")).toEqual({
			root: costCenter,
			found: costCenter,
		})
	})
	it("findParent", () => {
		expect(proquse.Delegation.findParent([costCenter], costCenter.usage[0].id)).toEqual({
			root: costCenter,
			found: costCenter,
		})
		expect(proquse.Delegation.findParent([costCenter.usage[1]], "c1d4d5d6")).toEqual({
			root: costCenter.usage[1],
			found: costCenter.usage[1].usage[0],
		})
		expect(proquse.Delegation.findParent([costCenter.usage[0]], "c1d4d5d6")).toEqual(undefined)
	})
	it("change", () => {
		let before: proquse.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2023-01-01T13:37:42Z",
					modified: "2023-01-01T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
					type: "delegation",
					usage: [],
				},
			],
		}
		let updated: proquse.Delegation = {
			id: "abcd0002",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: { interval: "single", value: 3_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [],
		}
		let after: proquse.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [{ ...updated }],
		}
		let result = proquse.Delegation.change([before], updated)
		expect(before).toEqual(after)
		expect(result).toEqual({ root: before, changed: updated })
		const final = { ...before, to: ["jane@example.com"] }
		result = proquse.Delegation.change([before], final)
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
			type: "delegation",
			usage: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2023-01-01T13:37:42Z",
					modified: "2023-01-01T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
					type: "delegation",
					usage: [],
				},
			],
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
			type: "delegation",
			usage: [],
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
			type: "delegation",
			usage: [{ ...updated }],
		}
		result = proquse.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
		updated = { ...updated, id: "abcd0001" }
		after = { ...updated }
		result = proquse.Delegation.change([before], updated)
		expect(result).toEqual(undefined)
	})
	it("remove", () => {
		const toBeRemoved: proquse.Delegation = {
			id: "abcd0003",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["jane@example.com"],
			purpose: "Partial company Budget",
			amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [],
		}
		const after: proquse.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2023-01-01T13:37:42Z",
			modified: "2023-01-01T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: { interval: "single", value: 20_000, currency: "EUR", created: "2023-01-01" },
			type: "delegation",
			usage: [
				{
					id: "abcd0002",
					from: "jane@example.com",
					costCenter: "budget",
					created: "2023-01-01T13:37:42Z",
					modified: "2023-01-01T13:37:42Z",
					to: ["jane@example.com"],
					purpose: "Partial company Budget",
					amount: { interval: "single", value: 2_000, currency: "EUR", created: "2023-01-01" },
					type: "delegation",
					usage: [],
				},
			],
		}
		const before: proquse.Delegation = {
			...after,
			usage: [...after.usage, toBeRemoved],
		}
		expect(proquse.Delegation.remove([before], toBeRemoved.id)).toEqual({ root: before, removed: toBeRemoved })
		expect(before).toEqual(after)
		expect(proquse.Delegation.remove([before], before.id)).toEqual({ root: before, removed: before })
		expect(proquse.Delegation.remove([after], "xyz")).toEqual(undefined)
	})
	it("spent", () => {
		expect(proquse.Delegation.spent(costCenter)).toEqual(748)
		expect(proquse.Delegation.spent(costCenter, { vat: false })).toEqual(718)
		expect(proquse.Delegation.spent(costCenter.usage[1])).toEqual(0)
		expect(proquse.Delegation.spent(costCenter.usage[0])).toEqual(748)
		expect(proquse.Delegation.spent(costCenter.usage[0], { vat: false })).toEqual(718)
		expect(proquse.Delegation.spent(costCenter.usage[0].usage[0] as proquse.Delegation, { vat: false })).toEqual(120)
		expect(proquse.Delegation.spent.balance(costCenter, "2023-12-31")).toEqual(19_252)
		expect(proquse.Delegation.spent.balance(costCenter, "2023-12-31", { vat: false })).toEqual(19_282)
		expect(proquse.Delegation.spent.balance(costCenter.usage[0], "2023-12-31")).toEqual(1_252)
		expect(proquse.Delegation.spent.balance(costCenter.usage[0], "2023-12-31", { vat: false })).toEqual(1_282)
	})
	it("allocated", () => {
		expect(proquse.Delegation.allocated(costCenter, "2023-12-31")).toEqual(6_000)
		expect(proquse.Delegation.allocated.balance(costCenter, "2023-12-31")).toEqual(14_000)
		expect(
			proquse.Delegation.allocated.balance(
				(costCenter.usage[1].usage[0] as proquse.Delegation | proquse.CostCenter).usage[0] as
					| proquse.Delegation
					| proquse.CostCenter,
				"2023-12-31"
			)
		).toEqual(1_000)
	})
	it("create", () => {
		expect(
			proquse.Delegation.is(
				proquse.Delegation.create({
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
		expect(proquse.Delegation.findParents([costCenter], "c1d1d2--")).toEqual([costCenter, costCenter.usage[0]])
		expect(proquse.Delegation.findParents([costCenter], "c1------")).toEqual([])
		expect(proquse.Delegation.findParents([costCenter], "c1d4d5d6")).toEqual([
			costCenter,
			costCenter.usage[1],
			costCenter.usage[1].usage[0],
		])
		expect(proquse.Delegation.findParents([costCenter], "c1d1----")).toEqual([costCenter])
		expect(proquse.Delegation.findParents([costCenter], "xyz")).toEqual(undefined)
	})
	it("path", () => {
		expect(proquse.Delegation.path([costCenter], "c1d4d5d6")).toEqual([
			costCenter,
			costCenter.usage[1],
			costCenter.usage[1].usage[0],
			(costCenter.usage[1].usage[0] as proquse.Delegation).usage[0],
		])
		expect(proquse.Delegation.path([costCenter], "c1------")).toEqual([costCenter])
		expect(proquse.Delegation.path([costCenter], "c1d1----")).toEqual([costCenter, costCenter.usage[0]])
		expect(proquse.Delegation.path([costCenter], "c1d1d2--")).toEqual([
			costCenter,
			costCenter.usage[0],
			costCenter.usage[0].usage[0],
		])
	})
	it("validate", () => {
		expect(proquse.Delegation.validate(initialDelegation, { date: "2023-12-31" })).toEqual(true)
	})
	it("sustainable", () => {
		const costCenter: proquse.CostCenter = {
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
					amount: { interval: "month", value: 550, currency: "USD", created: "2023-02-01" },
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
							amount: { interval: "week", value: 50, currency: "USD", created: "2023-03-28" },
							costCenter: "Development",
							created: "2023-01-01T13:37:42Z",
							modified: "2024-01-01T13:37:42Z",
							from: "james@example.com",
							purpose: "Software services",
							to: ["jessie@example.com"],
							type: "delegation",
							usage: [],
						},
						{
							id: "d3",
							amount: { interval: "day", value: 75, currency: "USD", created: "2023-03-29" },
							costCenter: "Development",
							created: "2023-01-01T13:37:42Z",
							modified: "2024-01-01T13:37:42Z",
							from: "james@example.com",
							purpose: "Software services",
							to: ["jessie@example.com"],
							type: "delegation",
							usage: [],
						},
					],
				},
			],
		}
		const end = "2023-12-31"
		const parentSustainableDate = isoly.Date.next(
			costCenter.amount.created,
			proquse.Cadence.sustainable(
				costCenter.amount,
				costCenter.usage.map(d => d.amount),
				end
			)
		)
		expect(parentSustainableDate).toEqual("2023-03-31")
		const delegations = structuredClone(proquse.Delegation.findUser([costCenter], "jessie@example.com"))
		const expected = structuredClone(delegations).map(d => ({
			...d,
			amount: {
				...d.amount,
				sustainable: "2023-04-16",
			},
		}))
		const result = proquse.Delegation.sustainable([costCenter], delegations, { date: end })
		expect(result).toBe(delegations)
		expect(result).toEqual(expected)
	})
})

import { issuefab } from "../index"

describe("Purchase", () => {
	const purchase: issuefab.Purchase = {
		id: "aoeu1234",
		created: "2022-01-01T00:00:42Z",
		modified: "2022-01-01T00:00:42Z",
		buyer: "richard.stevensson@example.com",
		amount: [951221, "EUR"],
		purpose: "Production Workers",
		email: "receipt@example.com",
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
	}
	const delegation: issuefab.Delegation = {
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
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
						from: "jane@example.com",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						purpose: "Cloudflare",
						amount: [120, "EUR"],
						delegations: [],
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
								id: "aoeu2345",
								email: "receipt@example.com",
								created: "2022-02-01T00:00:42Z",
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
						id: "aoeu3456",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						amount: [9.5, "EUR"],
						purpose: "Production Workers",
						payment: { type: "card", limit: [5, "EUR"] },
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
				from: "jane@example.com",
				created: "2021-12-28T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				purpose: "Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						from: "jane@example.com",
						costCenter: "IT",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						purpose: "Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								from: "jane@example.com",
								costCenter: "IT",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
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
		expect(issuefab.Purchase.is(purchase)).toEqual(true)
		expect(issuefab.Purchase.is((({ transactions, ...purchase }) => purchase)(purchase))).toEqual(false)
		expect(issuefab.Purchase.is((({ amount, ...purchase }) => purchase)(purchase))).toEqual(true)
		expect(issuefab.Purchase.is((({ email, ...purchase }) => purchase)(purchase))).toEqual(false)
	})
	it("create", () => {
		const purchase: issuefab.Purchase.Creatable = {
			purpose: "buy things",
			payment: {
				type: "card",
				limit: [10, "EUR"],
			},
			buyer: "jane@example.com",
		}
		const result = issuefab.Purchase.create(
			purchase,
			{ type: "card", limit: [10, "EUR"] },
			"organizationId",
			"receipt@example.com"
		)
		expect(issuefab.Purchase.is(result))
		expect(result.email).toMatch(/receipt\+organizationId|[^@]+@example.com/)
	})
	it("find", () => {
		expect(issuefab.Purchase.find([delegation], "aoeu1234")).toEqual({
			root: delegation,
			found: delegation.delegations[0].delegations[0].purchases[0],
		})
	})
	it("change", () => {
		const target: issuefab.Purchase = issuefab.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			{ type: "card", limit: [10, "EUR"] },
			"organizationId",
			"receipt@example.com"
		)
		const updated: issuefab.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: [10, "EUR"] },
			buyer: "john@example.com",
		}
		const after: issuefab.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: [10, "EUR"] },
			buyer: "john@example.com",
		}
		const root: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [],
			purchases: [target],
		}
		expect(target).not.toEqual(updated)
		const first = issuefab.Purchase.change(target, updated)
		expect(target).toEqual(after)
		expect(first).not.toBe(after)
		const second = issuefab.Purchase.change([root], updated)
		expect(second).toEqual({ root: root, changed: updated })
		expect(second?.changed).not.toBe(updated)
	})
	it("remove", () => {
		const target: issuefab.Purchase = issuefab.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			{ type: "card", limit: [10, "EUR"] },
			"organizationId",
			"receipt@example.com"
		)
		const root: issuefab.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [],
			purchases: [target],
		}
		const result = issuefab.Purchase.remove([root], target.id)
		expect(root.purchases.length).toEqual(0)
		expect(result?.removed).toBe(target)
	})
	it("validate", () => {
		const target: issuefab.Purchase = issuefab.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			{ type: "card", limit: [10, "EUR"] },
			"organizationId",
			"receipt@example.com"
		)

		expect(issuefab.Purchase.validate(target)).toEqual(true)
		expect(
			issuefab.Purchase.validate(
				issuefab.Purchase.create(
					{
						purpose: "",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "jane@example.com",
					},
					{ type: "card", limit: [10, "EUR"] },
					"organizationId",
					"receipt@example.com"
				)
			)
		).toEqual(true)
		expect(
			issuefab.Purchase.validate(
				issuefab.Purchase.create(
					{
						purpose: "buy things",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "",
					},
					{ type: "card", limit: [10, "EUR"] },
					"organizationId",
					"receipt@example.com"
				)
			)
		).toEqual(false)
		expect(
			issuefab.Purchase.validate(
				issuefab.Purchase.create(
					{
						purpose: "buy things",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "jane@example.com",
					},
					{ type: "card", limit: [10, "EUR"] },
					"organizationId",
					"receipt@example.com"
				),
				[10, "EUR"]
			)
		).toEqual(true)
		expect(
			issuefab.Purchase.validate(
				{
					...issuefab.Purchase.create(
						{
							purpose: "buy things",
							payment: {
								type: "card",
								limit: [10, "EUR"],
							},
							buyer: "jane@example.com",
						},
						{ type: "card", limit: [10, "EUR"] },
						"organizationId",
						"receipt@example.com"
					),
					amount: [2, "EUR"],
				},
				[1, "EUR"]
			)
		).toEqual(false)
		expect(
			issuefab.Purchase.validate(
				issuefab.Purchase.create(
					{
						purpose: "buy things",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "jane@example.com",
					},
					{ type: "card", limit: [10, "EUR"] },
					"organizationId",
					"receipt@example.com"
				),
				[10, "SEK"]
			)
		).toEqual(false)
	})
	it("list", () => {
		expect(issuefab.Purchase.list(delegation.delegations).length).toEqual(3)
		expect(
			issuefab.Purchase.list(delegation.delegations, purchase => purchase.amount && purchase.amount[0] < 10).length
		).toEqual(2)
		expect(
			issuefab.Purchase.list(delegation.delegations, purchase => purchase.buyer == "mary@example.com").length
		).toEqual(1)
		const result = issuefab.Purchase.list(
			[delegation],
			p => p.buyer == "mary@example.com",
			(p, d) => ({ ...p, delegationId: d.id })
		)
		expect(result.length).toEqual(1)
		expect(result.every(purchase => issuefab.Purchase.is(purchase) && purchase.delegationId)).toEqual(true)
	})
})

import * as model from "../index"

describe("Purchase", () => {
	const purchase: model.Purchase = {
		id: "aoeu1234",
		created: "2022-01-01T00:00:42Z",
		modified: "2022-01-01T00:00:42Z",
		buyer: "richard@example.com",
		amount: [9.5, "EUR"],
		purpose: "Production Workers",
		email: "receipt@example.com",
		payment: {
			type: "card",
			limit: [10, "EUR"],
			value: "someToken",
		},
		receipt: [
			{
				id: "id",
				amount: [10, "USD"],
				vat: 0,
				original: "https://example.com/receipt.pdf",
			},
		],
	}
	const delegation: model.Delegation = {
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
								payment: {
									type: "card",
									limit: [10, "EUR"],
									value: "someToken",
								},
								receipt: [
									{
										id: "id",
										amount: [10, "USD"],
										vat: 0,
										original: "https://example.com/receipt.pdf",
									},
								],
							},
							{
								id: "aoeu2345",
								email: "receipt@example.com",
								created: "2022-02-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: [10, "EUR"],
									value: "someToken",
								},
								receipt: [],
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
						payment: {
							type: "card",
							limit: [5, "EUR"],
							value: "someToken",
						},
						receipt: [
							{
								id: "id",
								amount: [10, "USD"],
								vat: 0,
								original: "https://example.com/receipt.pdf",
							},
						],
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
		expect(model.Purchase.is(purchase)).toEqual(true)
	})
	it("create", () => {
		const purchase: model.Purchase.Creatable = {
			purpose: "buy things",
			payment: {
				type: "card",
				limit: [10, "EUR"],
			},
			buyer: "jane@example.com",
		}
		const result = model.Purchase.create(purchase, "someToken", "organizationId", "receipt@example.com")
		expect(model.Purchase.is(result))
		expect(result.email).toMatch(/receipt\+organizationId|[^@]+@example.com/)
	})
	it("find", () => {
		expect(model.Purchase.find([delegation], "aoeu1234")).toEqual({
			root: delegation,
			found: delegation.delegations[0].delegations[0].purchases[0],
		})
	})
	it("change", () => {
		const target: model.Purchase = model.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			"someToken",
			"organizationId",
			"receipt@example.com"
		)
		const updated: model.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: [10, "EUR"], value: "someToken" },
			buyer: "john@example.com",
		}
		const after: model.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: [10, "EUR"], value: "someToken" },
			buyer: "john@example.com",
		}
		const root: model.Delegation = {
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
		const first = model.Purchase.change(target, updated)
		expect(target).toEqual(after)
		expect(first).not.toBe(after)
		const second = model.Purchase.change([root], updated)
		expect(second).toEqual({ root: root, changed: updated })
		expect(second?.changed).not.toBe(updated)
	})
	it("remove", () => {
		const target: model.Purchase = model.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			"someToken",
			"organizationId",
			"receipt@example.com"
		)
		const root: model.Delegation = {
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
		const result = model.Purchase.remove([root], target.id)
		expect(root.purchases.length).toEqual(0)
		expect(result?.removed).toBe(target)
	})
	it("validate", () => {
		const target: model.Purchase = model.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			"someToken",
			"organizationId",
			"receipt@example.com"
		)

		expect(model.Purchase.validate(target)).toEqual(true)
		expect(
			model.Purchase.validate(
				model.Purchase.create(
					{
						purpose: "",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "jane@example.com",
					},
					"someToken",
					"organizationId",
					"receipt@example.com"
				)
			)
		).toEqual(false)
		expect(
			model.Purchase.validate(
				model.Purchase.create(
					{
						purpose: "buy things",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "",
					},
					"someToken",
					"organizationId",
					"receipt@example.com"
				)
			)
		).toEqual(false)
		expect(
			model.Purchase.validate(
				model.Purchase.create(
					{
						purpose: "buy things",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "jane@example.com",
					},
					"someToken",
					"organizationId",
					"receipt@example.com"
				),
				[10, "EUR"]
			)
		).toEqual(true)
		expect(
			model.Purchase.validate(
				{
					...model.Purchase.create(
						{
							purpose: "buy things",
							payment: {
								type: "card",
								limit: [10, "EUR"],
							},
							buyer: "jane@example.com",
						},
						"someToken",
						"organizationId",
						"receipt@example.com"
					),
					amount: [2, "EUR"],
				},
				[1, "EUR"]
			)
		).toEqual(false)
		expect(
			model.Purchase.validate(
				model.Purchase.create(
					{
						purpose: "buy things",
						payment: {
							type: "card",
							limit: [10, "EUR"],
						},
						buyer: "jane@example.com",
					},
					"someToken",
					"organizationId",
					"receipt@example.com"
				),
				[10, "SEK"]
			)
		).toEqual(false)
	})
})

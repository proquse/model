import * as model from "../index"

describe("Purchase", () => {
	const purchase: model.Purchase = {
		id: "aoeu1234",
		created: "2022-01-01T00:00:42Z",
		modified: "2022-01-01T00:00:42Z",
		buyer: "richard@example.com",
		amount: [9.5, "EUR"],
		purpose: "Production Workers",
		payment: {
			type: "card",
			limit: [10, "EUR"],
			value: "someToken",
			supplier: "someSupplier",
		},
		receipt: {
			amount: [10, "USD"],
			vat: 0,
			original: "https://example.com/receipt.pdf",
		},
	}
	const delegation: model.Delegation = {
		id: "abcd0001",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
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
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [9.5, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: [10, "EUR"],
									value: "someToken",
									supplier: "someSupplier",
								},
								receipt: {
									amount: [10, "USD"],
									vat: 0,
									original: "https://example.com/receipt.pdf",
								},
							},
							{
								id: "aoeu2345",
								created: "2022-02-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: {
									type: "card",
									limit: [10, "EUR"],
									value: "someToken",
									supplier: "someSupplier",
								},
								receipt: { to: "receipt+aoeu1234@company.com" },
							},
						],
					},
				],
				purchases: [
					{
						id: "aoeu3456",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						amount: [9.5, "EUR"],
						purpose: "Production Workers",
						payment: {
							type: "card",
							limit: [5, "EUR"],
							value: "someToken",
							supplier: "someSupplier",
						},
						receipt: {
							amount: [10, "USD"],
							vat: 0,
							original: "https://example.com/receipt.pdf",
						},
					},
				],
			},
			{
				id: "abcd0004",
				created: "2021-12-28T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				purpose: "Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						purpose: "Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
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
		expect(model.Purchase.is(model.Purchase.create(purchase, "someSupplier", "someToken"))).toEqual(true)
	})
	it("find", () => {
		expect(model.Purchase.find(delegation, "aoeu1234")).toEqual(delegation.delegations[0].delegations[0].purchases[0])
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
			"someSupplier"
		)
		const updated: model.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: [10, "EUR"], value: "someToken", supplier: "someSupplier" },
			buyer: "john@example.com",
		}
		const after: model.Purchase = {
			...target,
			purpose: "buy more things",
			payment: { type: "card", limit: [10, "EUR"], value: "someToken", supplier: "someSupplier" },
			buyer: "john@example.com",
		}
		const root: model.Delegation = {
			id: "abcd0001",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [],
			purchases: [target],
		}
		expect(target).not.toEqual(updated)
		model.Purchase.change(target, updated)
		expect(target).toEqual(after)
		const result = model.Purchase.change(root, updated)
		expect(result).toEqual(updated)
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
			"someSupplier"
		)
		const root: model.Delegation = {
			id: "abcd0001",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			delegations: [],
			purchases: [target],
		}
		model.Purchase.remove(root, target.id)
		expect(root.purchases.length).toEqual(0)
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
			"someSupplier"
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
					"someSupplier"
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
					"someSupplier"
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
					"someSupplier"
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
						"someSupplier"
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
					"someSupplier"
				),
				[10, "SEK"]
			)
		).toEqual(false)
	})
})

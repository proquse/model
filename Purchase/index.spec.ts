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
			card: "4200000000000000/1015/969/richard doe",
		},
		receipt: {
			currency: "USD",
			amount: 10,
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
									card: "4200000000000000/1015/969/richard doe",
								},
								receipt: {
									currency: "USD",
									amount: 10,
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
									card: "4200000000000000/1015/969/richard doe",
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
							limit: [10, "EUR"],
							card: "4200000000000000/1015/969/mary doe",
						},
						receipt: {
							currency: "USD",
							amount: 10,
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
		expect(model.Purchase.is(model.Purchase.create(purchase, "0123456789101112/0122/969/Jane Doe"))).toEqual(true)
	})
	it("find", () => {
		const purchase = model.Purchase.find(delegation, "aoeu1234")
		console.log(purchase)
	})
})

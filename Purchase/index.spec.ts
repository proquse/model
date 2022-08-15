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
	it("is", () => {
		expect(model.Purchase.is(purchase)).toEqual(true)
	})
	it("create", () => {
		const purchase: model.Purchase.Creatable = {
			purpose: "buy things",
			buyer: "jane doe",
			payment: {
				type: "card",
				limit: [10, "EUR"],
			},
		}
		expect(model.Purchase.is(model.Purchase.create(purchase, "0123456789101112/0122/969/Jane Doe"))).toEqual(true)
	})
})

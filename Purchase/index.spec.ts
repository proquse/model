import * as model from "../index"

describe("Purchase", () => {
	const purchase: model.Purchase = {
		id: "aoeu1234",
		created: "2022-01-01T00:00:42Z",
		buyer: "richard@example.com",
		amount: [9.5, "EUR"],
		purpose: "Production Workers",
		payment: {
			type: "card",
			limit: [10, "EUR"],
			card: "4200000000/2202/aoeuhatns",
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
})

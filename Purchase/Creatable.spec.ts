import * as model from "../index"

describe("Purchase.Creatable", () => {
	const creatable: model.Purchase.Creatable = {
		purpose: "buy things",
		buyer: "jane doe",
		payment: {
			type: "card",
			limit: [10, "EUR"],
		},
	}
	it("is", () => {
		expect(model.Purchase.Creatable.is(creatable))
	})
})

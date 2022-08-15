import * as model from "../index"

describe("Purchase.Creatable", () => {
	const creatable: model.Purchase.Creatable = {
		purpose: "buy things",
		payment: {
			type: "card",
			limit: [10, "EUR"],
		},
	}
	it("is", () => {
		expect(model.Purchase.Creatable.is(creatable)).toEqual(true)
	})
})

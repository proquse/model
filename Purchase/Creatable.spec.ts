import * as model from "../index"

describe("Purchase.Creatable", () => {
	const creatable: model.Purchase.Creatable = {
		purpose: "buy things",
		payment: {
			type: "card",
			limit: [10, "EUR"],
		},
		buyer: "jane@example.com",
	}
	it("is", () => {
		expect(model.Purchase.Creatable.is(creatable)).toEqual(true)
	})
	it("validate", () => {
		expect(model.Purchase.Creatable.validate(creatable)).toEqual(true)
		expect(
			model.Purchase.Creatable.validate({ purpose: "asdas", payment: { type: "card", limit: [10, "EUR"] }, buyer: "" })
		).toEqual(false)
		expect(
			model.Purchase.Creatable.validate({ purpose: "", payment: { type: "card", limit: [10, "EUR"] }, buyer: "sasd" })
		).toEqual(true)
		expect(model.Purchase.Creatable.validate(creatable, [20, "EUR"])).toEqual(true)
		expect(model.Purchase.Creatable.validate(creatable, [5, "EUR"])).toEqual(false)
	})
})

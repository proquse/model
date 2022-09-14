import * as model from "../../../index"

describe("Card.Creatable", () => {
	const creatable: model.Payment.Card.Creatable = {
		type: "card",
		limit: [100, "EUR"],
	}
	it("is", () => {
		expect(model.Payment.Card.Creatable.is(creatable)).toEqual(true)
	})
	it("validate", () => {
		expect(model.Payment.Card.Creatable.validate(creatable)).toEqual(true)
		expect(model.Payment.Card.Creatable.validate(creatable, [99, "EUR"])).toEqual(false)
		expect(model.Payment.Card.Creatable.validate(creatable, [101, "SEK"])).toEqual(false)
		expect(model.Payment.Card.Creatable.validate(creatable, [101, "EUR"])).toEqual(true)
	})
})

import * as model from "../../../../index"

describe("Payment.Card.Token.Creatable", () => {
	const creatable: model.Payment.Card.Token.Creatable = {
		type: "card",
		limit: [100, "EUR"],
	}
	it("is", () => {
		expect(model.Payment.Card.Token.Creatable.is(creatable)).toEqual(true)
	})
	it("validate", () => {
		expect(model.Payment.Card.Token.Creatable.validate(creatable)).toEqual(true)
		expect(model.Payment.Card.Token.Creatable.validate(creatable, [99, "EUR"])).toEqual(false)
		expect(model.Payment.Card.Token.Creatable.validate(creatable, [101, "SEK"])).toEqual(false)
		expect(model.Payment.Card.Token.Creatable.validate(creatable, [101, "EUR"])).toEqual(true)
	})
})

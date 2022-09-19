import * as model from "../../../index"

describe("Payment.Card.Token", () => {
	const card: model.Payment.Card.Token = {
		type: "card",
		limit: [100, "EUR"],
		value: "someToken",
	}
	it("is", () => {
		expect(model.Payment.Card.Token.is(card)).toEqual(true)
	})
	it("validate", () => {
		expect(model.Payment.Card.Token.validate(card)).toEqual(true)
		expect(model.Payment.Card.Token.validate(card, [99, "EUR"])).toEqual(false)
	})
})

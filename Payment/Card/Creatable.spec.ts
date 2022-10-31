import * as model from "../../index"

describe("Payment.Card.Creatable", () => {
	const card: model.Payment.Card = {
		type: "card",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(model.Payment.Card.Creatable.is(card)).toEqual(true)
		expect(model.Payment.Card.is({ type: "invoice", limit: [10, "EUR"] }))
	})
})

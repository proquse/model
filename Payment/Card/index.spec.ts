import * as model from "../../index"

describe("Card", () => {
	const card: model.Payment.Card = {
		type: "card",
		limit: [100, "EUR"],
		card: "4200000000000000/1015/969/john doe",
	}
	it("is", () => {
		expect(model.Payment.Card.is(card)).toEqual(true)
	})
})

import * as model from "../../index"

describe("Payment.Card", () => {
	const card: model.Payment.Card = {
		cvc: "123",
		pan: "0123456789101112",
		holder: "Company",
		expire: {
			month: "10",
			year: "22",
		},
	}
	it("is", () => {
		expect(model.Payment.Card.is(card)).toEqual(true)
		expect(model.Payment.Card.is({ ...card, expire: { month: "13", year: "22" } })).toEqual(false)
		expect(model.Payment.Card.is({ ...card, pan: "123" })).toEqual(false)
	})
})

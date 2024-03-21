import { proquse } from "../../index"

describe("Payment.Card", () => {
	const card: proquse.Payment.Card.Creatable = {
		type: "card",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		key: "cde-public-key",
	}
	it("is", () => {
		expect(proquse.Payment.Card.is(card)).toEqual(true)
		expect(proquse.Payment.Card.is((({ key: key, ...card }) => card)(card))).toEqual(true)
		expect(proquse.Payment.Card.is((({ limit, ...card }) => card)(card))).toEqual(false)
		expect(proquse.Payment.Card.is({ ...card, details: { pan: "123" } })).toEqual(true)
	})
})

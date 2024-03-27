import { proquse } from "../../index"

describe("Payment.Card.Creatable", () => {
	const card: proquse.Payment.Card.Creatable = {
		type: "card",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		key: "cde-public-key",
	}
	it("is", () => {
		expect(proquse.Payment.Card.Creatable.is(card)).toEqual(true)
		expect(proquse.Payment.Card.Creatable.is((({ key: key, ...card }) => card)(card))).toEqual(true)
		expect(proquse.Payment.Card.Creatable.is((({ limit, ...card }) => card)(card))).toEqual(false)
		expect(proquse.Payment.Card.Creatable.is({ ...card, details: { pan: "123" } })).toEqual(true)
	})
})

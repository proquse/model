import { proquse } from "../../index"

describe("Payment.Card", () => {
	const card: proquse.Payment.Card = {
		type: "card",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		mask: "012345******6789",
		expires: { month: 4, year: 24 },
		reference: "our-suppliers-id-for-this-card",
		token: "some-card-token",
	}
	it("is", () => {
		expect(proquse.Payment.Card.is(card)).toEqual(true)
		expect(proquse.Payment.Card.is((({ token: key, ...card }) => card)(card))).toEqual(true)
		expect(proquse.Payment.Card.is((({ limit, ...card }) => card)(card))).toEqual(false)
		expect(proquse.Payment.Card.is((({ reference, ...card }) => card)(card))).toEqual(false)
		expect(proquse.Payment.Card.is({ ...card, details: { pan: "123" } })).toEqual(true)
	})
})

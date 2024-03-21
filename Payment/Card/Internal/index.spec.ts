import { proquse } from "../../../index"

describe("Payment.Card", () => {
	const card: proquse.Payment.Card.Internal = {
		type: "card-internal",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
		details: {
			csc: "123",
			pan: "0123456789101112",
			holder: "Company",
			expire: {
				month: "10",
				year: "22",
			},
		},
	}
	it("is", () => {
		expect(proquse.Payment.Card.Internal.is(card)).toEqual(true)
		expect(
			proquse.Payment.Card.Internal.is({ ...card, details: { ...card.details, expire: { month: "13", year: "22" } } })
		).toEqual(false)
		expect(proquse.Payment.Card.Internal.is({ ...card, details: { pan: "123" } })).toEqual(false)
	})
})

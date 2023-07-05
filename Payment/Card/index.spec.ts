import { issuefab } from "../../index"

describe("Payment.Card", () => {
	const card: issuefab.Payment.Card = {
		type: "card",
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
		expect(issuefab.Payment.Card.is(card)).toEqual(true)
		expect(
			issuefab.Payment.Card.is({ ...card, details: { ...card.details, expire: { month: "13", year: "22" } } })
		).toEqual(false)
		expect(issuefab.Payment.Card.is({ ...card, details: { pan: "123" } })).toEqual(false)
	})
})

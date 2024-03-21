import { proquse } from "../../../index"

describe("Payment.Card.Creatable", () => {
	const payment: proquse.Payment.Card = {
		type: "card",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(proquse.Payment.Card.Creatable.is(payment)).toEqual(true)
		expect(proquse.Payment.Card.Creatable.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
		expect(proquse.Payment.Card.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(proquse.Payment.Card.is({ ...payment, limit: [10, "EUR"] })).toEqual(false)
	})
})

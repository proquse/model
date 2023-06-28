import { issuefab } from "../../index"

describe("Payment.Card.Creatable", () => {
	const payment: issuefab.Payment.Card = {
		type: "card",
		limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(issuefab.Payment.Card.Creatable.is(payment)).toEqual(true)
		expect(issuefab.Payment.Card.Creatable.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
		expect(issuefab.Payment.Card.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(issuefab.Payment.Card.is({ ...payment, limit: [10, "EUR"] })).toEqual(false)
	})
})

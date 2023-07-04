import { issuefab } from "../../index"

describe("Payment.PrePaid.Creatable", () => {
	const payment: issuefab.Payment.PrePaid = {
		type: "pre-paid",
		limit: {
			interval: "month",
			value: 10,
			currency: "EUR",
			created: "2023-01-01",
		},
	}
	it("is", () => {
		expect(issuefab.Payment.PrePaid.is(payment)).toEqual(true)
		expect(issuefab.Payment.PrePaid.is({ ...payment, type: "invoice" })).toEqual(false)
	})
})

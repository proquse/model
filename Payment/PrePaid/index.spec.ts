import { issuefab } from "../../index"

describe("Payment.Prepaid", () => {
	const payment: issuefab.Payment.PrePaid = {
		type: "pre-paid",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(issuefab.Payment.PrePaid.Creatable.is(payment)).toEqual(true)
		expect(issuefab.Payment.PrePaid.is(payment)).toEqual(true)
		expect(issuefab.Payment.PrePaid.is((({ type, ...prePaid }) => prePaid)(payment))).toEqual(false)
		expect(issuefab.Payment.PrePaid.type.get({ ...payment, wrong: "extra property" })).toEqual(payment)
		expect(issuefab.Payment.PrePaid.is({ ...payment, type: "invoice" })).toEqual(false)
	})
})

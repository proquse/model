import { proquse } from "../../index"

describe("Payment.Prepaid", () => {
	const payment: proquse.Payment.PrePaid = {
		type: "pre-paid",
		limit: { interval: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(proquse.Payment.PrePaid.Creatable.is(payment)).toEqual(true)
		expect(proquse.Payment.PrePaid.is(payment)).toEqual(true)
		expect(proquse.Payment.PrePaid.is((({ type, ...prePaid }) => prePaid)(payment))).toEqual(false)
		expect(proquse.Payment.PrePaid.type.get({ ...payment, wrong: "extra property" })).toEqual(payment)
		expect(proquse.Payment.PrePaid.is({ ...payment, type: "invoice" })).toEqual(false)
	})
})

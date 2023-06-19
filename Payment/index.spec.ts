import { issuefab } from "../index"

describe("Payment", () => {
	const payment: issuefab.Payment = {
		type: "card",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(issuefab.Payment.is(payment)).toEqual(true)
		expect(issuefab.Payment.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(issuefab.Payment.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})

	it("validate", () => {
		expect(issuefab.Payment.validate(payment)).toEqual(true)
		expect(issuefab.Payment.validate(payment, [10, "EUR"])).toEqual(true)
		expect(issuefab.Payment.validate(payment, [9, "EUR"])).toEqual(false)
		expect(issuefab.Payment.validate({ type: "card", limit: [-1, "EUR"] })).toEqual(false)
	})
})

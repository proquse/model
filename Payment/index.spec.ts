import { issuefab } from "../index"

describe("Payment", () => {
	const payment: issuefab.Payment = {
		type: "card",
		limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	const expense: issuefab.Payment = {
		type: "expense",
		limit: { cadence: "month", value: 10, currency: "EUR", created: "2023-01-01" },
	}
	it("is", () => {
		expect(issuefab.Payment.is(payment)).toEqual(true)
		expect(issuefab.Payment.is({ ...expense, type: "pre-paid" })).toEqual(true)
		expect(issuefab.Payment.is(expense)).toEqual(true)
		expect(issuefab.Payment.is({ ...payment, type: "invoice" })).toEqual(false)
		expect(issuefab.Payment.is((({ type, ...payment }) => payment)(payment))).toEqual(false)
	})
})

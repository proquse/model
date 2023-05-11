import { issuefab } from "../../index"

describe("Payment.PrePaid.Creatable", () => {
	const prePaid: issuefab.Payment.PrePaid = {
		type: "pre-paid",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(issuefab.Payment.PrePaid.is(prePaid)).toEqual(true)
		expect(issuefab.Payment.PrePaid.is({ type: "invoice", limit: [10, "EUR"] })).toEqual(false)
	})
})

import { issuefab as issueFab } from "../../index"

describe("Payment.Card.Creatable", () => {
	const prePaid: issueFab.Payment.PrePaid = {
		type: "pre-paid",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(issueFab.Payment.PrePaid.is(prePaid)).toEqual(true)
		expect(issueFab.Payment.PrePaid.is({ type: "invoice", limit: [10, "EUR"] })).toEqual(false)
	})
})

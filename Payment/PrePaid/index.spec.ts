import { issuefab } from "../../index"

describe("Payment.Prepaid", () => {
	const prePaid: issuefab.Payment.PrePaid = {
		type: "pre-paid",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(issuefab.Payment.PrePaid.Creatable.is(prePaid)).toEqual(true)
		expect(issuefab.Payment.PrePaid.is(prePaid)).toEqual(true)
		expect(issuefab.Payment.PrePaid.is((({ type, ...prePaid }) => prePaid)(prePaid))).toEqual(false)
		expect(issuefab.Payment.PrePaid.type.get({ ...prePaid, wrong: "extra property" })).toEqual(prePaid)
		expect(issuefab.Payment.PrePaid.is({ type: "invoice", limit: [10, "EUR"] })).toEqual(false)
	})
})

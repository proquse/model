import { issuefab } from "../index"
import { Creatable } from "./Creatable"

describe("Payment.Creatable", () => {
	it("is", () => {
		const creatableCard: issuefab.Payment.Creatable.Card = { type: "card", limit: [123, "SEK"] }
		const creatablePrePaid: issuefab.Payment.Creatable.PrePaid = { type: "pre-paid", limit: [123, "SEK"] }

		expect(Creatable.is(creatableCard)).toEqual(true)
		expect(Creatable.is(creatablePrePaid)).toEqual(true)
		expect(Creatable.is({ ...creatableCard, type: "expense" })).toEqual(true)
		expect(Creatable.is({ ...creatablePrePaid, type: "Blaha" })).toEqual(false)
	})
})

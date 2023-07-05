import { issuefab } from "../index"
import { Creatable } from "./Creatable"

describe("Payment.Creatable", () => {
	it("is", () => {
		const card: issuefab.Payment.Creatable.Card = {
			type: "card",
			limit: { interval: "month", value: 123, currency: "SEK", created: "2023-01-01" },
		}
		const prePaid: issuefab.Payment.Creatable.PrePaid = {
			...card,
			type: "pre-paid",
		}

		expect(Creatable.is(card)).toEqual(true)
		expect(Creatable.is(prePaid)).toEqual(true)
		expect(Creatable.is({ ...card, type: "expense" })).toEqual(true)
		expect(Creatable.is({ ...prePaid, type: "Blaha" })).toEqual(false)
	})
})

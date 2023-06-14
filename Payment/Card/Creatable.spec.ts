import { issuefab } from "../../index"

describe("Payment.Card.Creatable", () => {
	const card: issuefab.Payment.Card = {
		type: "card",
		limit: [10, "EUR"],
	}
	it("is", () => {
		expect(issuefab.Payment.Card.Creatable.is(card)).toEqual(true)
		expect(issuefab.Payment.Card.Creatable.is((({ type, ...card }) => card)(card))).toEqual(false)
		expect(issuefab.Payment.Card.is({ type: "invoice", limit: [10, "EUR"] }))
	})
})

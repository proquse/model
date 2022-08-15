import * as model from "../../index"

describe("Card.Creatable", () => {
	const creatable: model.Card.Creatable = {
		type: "card",
		limit: [100, "EUR"],
	}
	it("is", () => {
		expect(model.Card.Creatable.is(creatable)).toEqual(true)
	})
})

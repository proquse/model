import * as model from "../../index"

describe("Card.Creatable", () => {
	const creatable: model.Card.Creatable = {
		type: "card",
		limit: [100, "EUR"],
	}
	it("is", () => {
		expect(model.Card.Creatable.is(creatable)).toEqual(true)
	})
	it("validate", () => {
		expect(model.Card.Creatable.validate(creatable)).toEqual(true)
		expect(model.Card.Creatable.validate(creatable, [99, "EUR"])).toEqual(false)
		expect(model.Card.Creatable.validate(creatable, [101, "SEK"])).toEqual(false)
		expect(model.Card.Creatable.validate(creatable, [101, "EUR"])).toEqual(true)
	})
})

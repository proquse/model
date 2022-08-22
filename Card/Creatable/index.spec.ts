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
		expect(model.Card.Creatable.validate(creatable, 99)).toEqual(false)
		expect(model.Card.Creatable.validate(creatable, undefined, "SEK")).toEqual(false)
		expect(model.Card.Creatable.validate(creatable, undefined, undefined)).toEqual(true)
	})
})

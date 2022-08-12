import * as model from "../index"

describe("Card", () => {
	const card: model.Card = {
		card: "4200000000000000/1015/969/gjdfölskgj fsfghfkljjjjj",
	}
	it("is", () => {
		expect(model.Card.is(card)).toEqual(true)
	})
})

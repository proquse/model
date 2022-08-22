import * as model from "../../index"

describe("Delegation.Data", () => {
	const data: model.Delegation.Data = {
		id: "abcd0001",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		purchases: [],
	}
	it("is", () => {
		expect(model.Delegation.Data.is(data)).toEqual(true)
	})
	it("to", () => {
		const delegation: model.Delegation = {
			id: "abcd0001",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["john@example.com"],
			purpose: "Total company Budget",
			amount: [20000, "EUR"],
			purchases: [],
			delegations: [],
		}
		const data = model.Delegation.Data.to(delegation)
		expect(model.Delegation.Data.is(data)).toEqual(true)
		expect(model.Delegation.is(data)).toEqual(false)
	})
	
})

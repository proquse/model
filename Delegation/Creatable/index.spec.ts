import * as model from "../../index"

describe("Delegation.Creatable", () => {
	const creatable: model.Delegation.Creatable = {
		to: ["jessie@example.com"],
		purpose: "testing",
		amount: [10, "EUR"],
	}
	it("is", () => {
		const delegation: model.Delegation = {
			id: "abcd0001",
			created: "2021-12-20T13:37:42Z",
			modified: "2021-12-20T13:37:42Z",
			to: ["james@example.com"],
			purpose: "testing",
			amount: [10, "EUR"],
			delegations: [],
			purchases: [],
		}
		expect(model.Delegation.Creatable.is(creatable)).toEqual(true)
		expect(model.Delegation.Creatable.is(delegation)).toEqual(true)
	})
	it("equals", () => {
		const first: model.Delegation.Creatable = {
			to: ["james@example.com"],
			purpose: "testing",
			amount: [10, "EUR"],
		}
		const second: model.Delegation.Creatable = {
			to: ["james@example.com"],
			purpose: "testing",
			amount: [10, "EUR"],
		}
		expect(model.Delegation.Creatable.equals(first, second)).toEqual(true)
		expect(model.Delegation.Creatable.equals(first, creatable)).toEqual(false)
	})
	it("create", () => {
		expect(model.Delegation.Creatable.is(model.Delegation.Creatable.create())).toEqual(true)
		expect(model.Delegation.Creatable.is(model.Delegation.Creatable.create(undefined, undefined, "USD"))).toEqual(true)
	})
})

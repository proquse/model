import * as model from "../../index"

describe("Delegation.Data", () => {
	const data: model.Delegation.Data = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
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
			from: "jane@example.com",
			costCenter: "budget",
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
	it("validate", () => {
		const purchase: model.Purchase = model.Purchase.create(
			{
				purpose: "buy things",
				payment: {
					type: "card",
					limit: [10, "EUR"],
				},
				buyer: "jane@example.com",
			},
			"someToken",
			"someSupplier"
		)
		expect(model.Delegation.Data.validate(data)).toEqual(true)
		expect(
			model.Delegation.Data.validate({
				id: "",
				from: "jane@example.com",
				costCenter: "budget",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["john@example.com"],
				purpose: "Total company Budget",
				amount: [20000, "EUR"],
				purchases: [],
			})
		).toEqual(false)
		expect(
			model.Delegation.Data.validate({
				id: "abcd0001",
				from: "jane@example.com",
				costCenter: "budget",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-11-20T13:37:42Z",
				to: ["john@example.com"],
				purpose: "Total company Budget",
				amount: [20000, "EUR"],
				purchases: [],
			})
		).toEqual(false)
		expect(
			model.Delegation.Data.validate({
				id: "abcd0001",
				from: "jane@example.com",
				costCenter: "budget",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: [""],
				purpose: "Total company Budget",
				amount: [20000, "EUR"],
				purchases: [],
			})
		).toEqual(false)
		expect(
			model.Delegation.Data.validate({
				id: "abcd0001",
				from: "jane@example.com",
				costCenter: "budget",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["john@example.com"],
				purpose: "",
				amount: [20000, "EUR"],
				purchases: [],
			})
		).toEqual(false)
		expect(
			model.Delegation.Data.validate({
				id: "abcd0001",
				from: "jane@example.com",
				costCenter: "budget",
				created: "2021-12-20T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["john@example.com"],
				purpose: "Total company Budget",
				amount: [20000, "EUR"],
				purchases: [purchase],
			})
		).toEqual(true)
	})
})

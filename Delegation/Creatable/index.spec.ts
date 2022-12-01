import * as model from "../../index"

describe("Delegation.Creatable", () => {
	const creatable: model.Delegation.Creatable = {
		to: ["jessie@example.com"],
		purpose: "testing",
		amount: [10, "EUR"],
		costCenter: "budget",
	}
	it("is", () => {
		const delegation: model.Delegation = {
			id: "abcd0001",
			from: "jane@example.com",
			costCenter: "budget",
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
			costCenter: "budget",
		}
		const second: model.Delegation.Creatable = {
			to: ["james@example.com"],
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		const third: model.Delegation.Creatable = {
			to: [],
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		expect(model.Delegation.Creatable.equals(third, first)).toEqual(false)
		expect(model.Delegation.Creatable.equals(first, second)).toEqual(true)
		expect(model.Delegation.Creatable.equals(first, creatable)).toEqual(false)
	})
	it("create", () => {
		expect(model.Delegation.Creatable.is(model.Delegation.Creatable.create())).toEqual(true)
		expect(model.Delegation.Creatable.is(model.Delegation.Creatable.create(undefined, undefined, [0, "USD"]))).toEqual(
			true
		)
		expect(
			model.Delegation.Creatable.is(model.Delegation.Creatable.create(["testTo"], "testPurpose", [11, "EUR"]))
		).toEqual(true)
	})
	it("validate", () => {
		expect(
			model.Delegation.Creatable.validate(
				model.Delegation.Creatable.create([], "testPurpose", [0, "EUR"], "testCostCenter"),
				undefined,
				true
			)
		).toEqual(true)
		expect(
			model.Delegation.Creatable.validate(
				model.Delegation.Creatable.create([""], "testPurpose", [0, "EUR"], "testCostCenter"),
				undefined,
				true
			)
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(
				model.Delegation.Creatable.create([], "testPurpose", [0, "EUR"], ""),
				undefined,
				true
			)
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(
				model.Delegation.Creatable.create([], "", [0, "EUR"], "testCostCenter"),
				undefined,
				true
			)
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(model.Delegation.Creatable.create([""], "", [0, "SEK"]), [10, "EUR"])
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(
				model.Delegation.Creatable.create(["testTo"], "testPurpose", [9, "EUR"], "budget"),
				[10, "EUR"]
			)
		).toEqual(true)
		expect(
			model.Delegation.Creatable.validate(model.Delegation.Creatable.create([""], "testPurpose", [9, "EUR"]), [
				10,
				"EUR",
			])
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(model.Delegation.Creatable.create(["testTo"], "", [9, "EUR"]), [10, "EUR"])
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(model.Delegation.Creatable.create(["testTo"], "testPurpose", [11, "EUR"]), [
				10,
				"EUR",
			])
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(model.Delegation.Creatable.create(["testTo"], "testPurpose", [9, "SEK"]), [
				10,
				"EUR",
			])
		).toEqual(false)
		expect(
			model.Delegation.Creatable.validate(model.Delegation.Creatable.create(undefined, "testPurpose", [9, "EUR"]), [
				10,
				"EUR",
			])
		).toEqual(false)
	})
})

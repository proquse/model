import { issuefab } from "../../index"

describe("Delegation.Creatable", () => {
	const creatable: issuefab.Delegation.Creatable = {
		to: ["jessie@example.com"],
		purpose: "testing",
		amount: [10, "EUR"],
		costCenter: "budget",
	}
	it("is", () => {
		const delegation: issuefab.Delegation = {
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
		expect(issuefab.Delegation.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Delegation.Creatable.is(delegation)).toEqual(true)
	})
	it("equals", () => {
		const first: issuefab.Delegation.Creatable = {
			to: ["james@example.com"],
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		const second: issuefab.Delegation.Creatable = {
			to: ["james@example.com"],
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		const third: issuefab.Delegation.Creatable = {
			to: [],
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		expect(issuefab.Delegation.Creatable.equals(third, first)).toEqual(false)
		expect(issuefab.Delegation.Creatable.equals(first, second)).toEqual(true)
		expect(issuefab.Delegation.Creatable.equals(first, creatable)).toEqual(false)
	})
	it("create", () => {
		expect(issuefab.Delegation.Creatable.is(issuefab.Delegation.Creatable.create())).toEqual(true)
		expect(
			issuefab.Delegation.Creatable.is(issuefab.Delegation.Creatable.create(undefined, undefined, [0, "USD"]))
		).toEqual(true)
		expect(
			issuefab.Delegation.Creatable.is(issuefab.Delegation.Creatable.create(["testTo"], "testPurpose", [11, "EUR"]))
		).toEqual(true)
	})
	it("validate", () => {
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create([], "testPurpose", [0, "EUR"], "testCostCenter"),
				undefined,
				true
			)
		).toEqual(true)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create([""], "testPurpose", [0, "EUR"], "testCostCenter"),
				undefined,
				true
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create([], "testPurpose", [0, "EUR"], ""),
				undefined,
				true
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create([], "", [0, "EUR"], "testCostCenter"),
				undefined,
				true
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(issuefab.Delegation.Creatable.create([""], "", [0, "SEK"]), [10, "EUR"])
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create(["testTo"], "testPurpose", [9, "EUR"], "budget"),
				[10, "EUR"]
			)
		).toEqual(true)
		expect(
			issuefab.Delegation.Creatable.validate(issuefab.Delegation.Creatable.create([""], "testPurpose", [9, "EUR"]), [
				10,
				"EUR",
			])
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(issuefab.Delegation.Creatable.create(["testTo"], "", [9, "EUR"]), [
				10,
				"EUR",
			])
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create(["testTo"], "testPurpose", [11, "EUR"]),
				[10, "EUR"]
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create(["testTo"], "testPurpose", [9, "SEK"]),
				[10, "EUR"]
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				issuefab.Delegation.Creatable.create(undefined, "testPurpose", [9, "EUR"]),
				[10, "EUR"]
			)
		).toEqual(false)
	})
})

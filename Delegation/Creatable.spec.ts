import { issuefab } from "../index"

describe("Delegation.Creatable", () => {
	const creatable: issuefab.Delegation.Creatable = {
		to: ["jessie@example.com"],
		from: "james@example.com",
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
			from: "jessie@example.com",
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		const second: issuefab.Delegation.Creatable = {
			to: ["james@example.com"],
			from: "jessie@example.com",
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		const third: issuefab.Delegation.Creatable = {
			to: [],
			from: "jessie@example.com",
			purpose: "testing",
			amount: [10, "EUR"],
			costCenter: "budget",
		}
		expect(issuefab.Delegation.Creatable.equals(third, first)).toEqual(false)
		expect(issuefab.Delegation.Creatable.equals(first, second)).toEqual(true)
		expect(issuefab.Delegation.Creatable.equals(first, creatable)).toEqual(false)
	})
	it("validate", () => {
		expect(
			issuefab.Delegation.Creatable.validate(
				{
					to: [],
					from: "jessie@example.com",
					purpose: "testPurpose",
					amount: [0, "EUR"],
					costCenter: "testCostCenter",
				},
				undefined
			)
		).toEqual(true)
		expect(
			issuefab.Delegation.Creatable.validate(
				{
					to: [""],
					from: "jessie@example.com",
					purpose: "testPurpose",
					amount: [0, "EUR"],
					costCenter: "testCostCenter",
				},
				undefined
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				{
					to: [],
					from: "jessie@example.com",
					purpose: "testPurpose",
					amount: [0, "EUR"],
					costCenter: "",
				},
				undefined
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				{
					to: [],
					from: "jessie@example.com",
					purpose: "",
					amount: [0, "EUR"],
					costCenter: "testCostCenter",
				},
				undefined
			)
		).toEqual(false)
		expect(
			issuefab.Delegation.Creatable.validate(
				{
					to: ["james@example.com"],
					from: "jessie@example.com",
					purpose: "testPurpose",
					amount: [9, "EUR"],
					costCenter: "testCostCenter",
				},
				[10, "EUR"]
			)
		).toEqual(true)
		expect(
			issuefab.Delegation.Creatable.validate(
				{
					to: ["james@example.com"],
					from: "jessie@example.com",
					purpose: "testPurpose",
					amount: [11, "EUR"],
					costCenter: "testCostCenter",
				},
				[10, "EUR"]
			)
		).toEqual(false)
	})
})

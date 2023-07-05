import { issuefab } from "../index"

describe("Delegation.Creatable", () => {
	const creatable: issuefab.Delegation.Creatable = {
		to: ["jessie@example.com"],
		from: "james@example.com",
		purpose: "testing",
		amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
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
			amount: { interval: "year", value: 500, currency: "EUR", created: "2023-01-01" },
			delegations: [],
			purchases: [],
		}
		expect(issuefab.Delegation.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.Delegation.Creatable.is(delegation)).toEqual(true)
		expect(issuefab.Delegation.Creatable.is((({ to, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(issuefab.Delegation.Creatable.is((({ from, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(issuefab.Delegation.Creatable.is((({ purpose, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(issuefab.Delegation.Creatable.is((({ amount, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(issuefab.Delegation.Creatable.is((({ costCenter, ...creatable }) => creatable)(creatable))).toEqual(false)
	})
})

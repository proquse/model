import { issuefab } from "../index"

describe("CostCenter.Creatable", () => {
	const creatable: issuefab.CostCenter.Creatable = {
		from: "jessie@rocket.com",
		name: "Development",
		description: "Description",
		amount: [10, "USD"],
	}
	it("is", () => {
		expect(issuefab.CostCenter.Creatable.is(creatable)).toEqual(true)
		expect(issuefab.CostCenter.Creatable.is({ ...creatable, amount: [NaN, "USD"] })).toEqual(false)
		expect(issuefab.CostCenter.Creatable.is((({ from, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(issuefab.CostCenter.Creatable.is((({ amount, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(issuefab.CostCenter.Creatable.is((({ name, ...creatable }) => creatable)(creatable))).toEqual(false)
	})
})

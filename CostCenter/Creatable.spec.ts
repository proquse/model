import { proquse } from "../index"

describe("CostCenter.Creatable", () => {
	const creatable: proquse.CostCenter.Creatable = {
		from: "jessie@rocket.com",
		name: "Development",
		description: "Description",
		amount: { interval: "year", value: 500, currency: "USD", created: "2023-01-01" },
	}
	it("is", () => {
		expect(proquse.CostCenter.Creatable.is(creatable)).toEqual(true)
		expect(proquse.CostCenter.Creatable.is({ ...creatable, amount: [NaN, "USD"] })).toEqual(false)
		expect(proquse.CostCenter.Creatable.is((({ from, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(proquse.CostCenter.Creatable.is((({ amount, ...creatable }) => creatable)(creatable))).toEqual(false)
		expect(proquse.CostCenter.Creatable.is((({ name, ...creatable }) => creatable)(creatable))).toEqual(false)
	})
	it("create", () => {
		expect(proquse.CostCenter.is(proquse.CostCenter.create(creatable))).toEqual(true)
	})
})

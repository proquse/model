import { issuefab } from "../index"

describe("CostCenter", () => {
	it("exports", () => {
		expect(typeof issuefab.CostCenter.balance).toEqual("function")
		expect(typeof issuefab.CostCenter.change).toEqual("function")
		expect(typeof issuefab.CostCenter.create).toEqual("function")
		expect(typeof issuefab.CostCenter.find).toEqual("function")
		expect(typeof issuefab.CostCenter.findParent).toEqual("function")
		expect(typeof issuefab.CostCenter.findParents).toEqual("function")
		expect(typeof issuefab.CostCenter.findUser).toEqual("function")
		expect(typeof issuefab.CostCenter.is).toEqual("function")
		expect(typeof issuefab.CostCenter.path).toEqual("function")
		expect(typeof issuefab.CostCenter.remove).toEqual("function")
		expect(typeof issuefab.CostCenter.spent).toEqual("function")
		expect(typeof issuefab.CostCenter.validate).toEqual("function")
	})
})

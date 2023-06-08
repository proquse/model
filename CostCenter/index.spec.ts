import { issuefab } from "../index"

describe("CostCenter", () => {
	it("exports", () => {
		expect(issuefab.CostCenter.balance).toEqual(issuefab.Delegation.balance)
		expect(issuefab.CostCenter.change).toEqual(issuefab.Delegation.change)
		expect(issuefab.CostCenter.create).toEqual(issuefab.Delegation.create)
		expect(issuefab.CostCenter.find).toEqual(issuefab.Delegation.find)
		expect(issuefab.CostCenter.findParent).toEqual(issuefab.Delegation.findParent)
		expect(issuefab.CostCenter.findParents).toEqual(issuefab.Delegation.findParents)
		expect(issuefab.CostCenter.findUser).toEqual(issuefab.Delegation.findUser)
		expect(issuefab.CostCenter.is).toEqual(issuefab.Delegation.is)
		expect(issuefab.CostCenter.path).toEqual(issuefab.Delegation.path)
		expect(issuefab.CostCenter.remove).toEqual(issuefab.Delegation.remove)
		expect(issuefab.CostCenter.spent).toEqual(issuefab.Delegation.spent)
		expect(issuefab.CostCenter.validate).toEqual(issuefab.Delegation.validate)
	})
})

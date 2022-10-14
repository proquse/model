import * as model from "../index"

describe("Transaction.Creatable", () => {
	const transaction: model.Transaction.Creatable = {
		amount: [10, "EUR"],
		descriptor: "hello world",
		date: {
			transaction: "2021-12-22T13:37:42Z",
		},
		purchaseId: "purchaseId",
		balance: [-10, "EUR"],
	}
	it("is", () => {
		expect(model.Transaction.Creatable.is(transaction)).toEqual(true)
		expect(
			model.Transaction.Creatable.is({ ...transaction, date: { ...transaction.date, payment: "2021-12-22T13:37:42Z" } })
		).toEqual(true)
		expect(model.Transaction.Creatable.is({ ...transaction, receiptId: "receiptId" })).toEqual(true)
		expect(model.Transaction.is({ ...transaction, reference: "referenceId" }))
	})
})

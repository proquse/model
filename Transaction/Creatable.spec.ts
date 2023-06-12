import { issuefab } from "../index"

describe("Transaction.Creatable", () => {
	const transaction: issuefab.Transaction.Creatable = {
		amount: [10, "EUR"],
		descriptor: "hello world",
		date: {
			transaction: "2021-12-22T13:37:42Z",
		},
		purchaseId: "purchaseId",
		balance: [-10, "EUR"],
	}
	it("is", () => {
		expect(issuefab.Transaction.Creatable.is(transaction)).toEqual(true)
		expect(
			issuefab.Transaction.Creatable.is({
				...transaction,
				date: { ...transaction.date, payment: "2021-12-22T13:37:42Z" },
			})
		).toEqual(true)
		expect(issuefab.Transaction.Creatable.is({ ...transaction, receiptId: "receiptId" })).toEqual(true)
		expect(issuefab.Transaction.is({ ...transaction, reference: "referenceId" }))
	})
})

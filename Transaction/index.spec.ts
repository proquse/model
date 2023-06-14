import { issuefab } from "../index"
describe("Transaction", () => {
	const creatable: issuefab.Transaction.Creatable = {
		amount: [10, "EUR"],
		descriptor: "hello world",
		date: {
			transaction: "2021-12-22T13:37:42Z",
		},
		purchaseId: "purchaseId",
		balance: [-10, "EUR"],
	}
	const transaction: issuefab.Transaction = {
		id: "asd",
		reference: "123",
		purchaseId: "y",
		descriptor: "jest test",
		amount: [10, "EUR"],
		date: {
			transaction: "2021-12-22T13:37:42Z",
			payment: "2021-12-22T13:37:42Z",
		},
		receiptId: "qwe",
		balance: [-10, "EUR"],
	}
	const delegation: issuefab.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				from: "jane@example.com",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				purpose: "hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
						from: "jane@example.com",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						purpose: "Cloudflare",
						amount: [120, "EUR"],
						delegations: [],
						purchases: [
							{
								id: "aoeu1234",
								email: "receipt@example.com",
								created: "2022-01-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [9.5, "EUR"],
								purpose: "Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [
									{
										id: "q",
										total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
										date: "2022-01-01T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
								transactions: [
									{
										id: "1",
										purchaseId: "y",
										date: {
											payment: "2022-01-01T00:00:42Z",
											transaction: "2022-01-02T00:00:42Z",
										},
										descriptor: "something",
										reference: "someId",
										amount: [10, "USD"],
										balance: [-10, "EUR"],
									},
								],
							},
							{
								id: "aoeu2345",
								email: "receipt@example.com",
								created: "2022-02-01T00:00:42Z",
								modified: "2022-01-01T00:00:42Z",
								buyer: "richard@example.com",
								amount: [10, "EUR"],
								purpose: "Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [
									{
										id: "w",
										total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
										date: "2022-01-01T00:00:42Z",
										original: "https://example.com/receipt.pdf",
									},
								],
								transactions: [
									{
										id: "2",
										purchaseId: "y",
										date: {
											payment: "2022-01-01T00:00:42Z",
											transaction: "2022-01-02T00:00:42Z",
										},
										descriptor: "something",
										reference: "someId",
										amount: [9, "USD"],
										balance: [-9, "EUR"],
									},
								],
							},
						],
					},
				],
				purchases: [
					{
						id: "aoeu3456",
						email: "receipt@example.com",
						created: "2022-01-01T00:00:42Z",
						modified: "2022-01-01T00:00:42Z",
						buyer: "mary@example.com",
						amount: [9.5, "EUR"],
						purpose: "Production Workers",
						payment: { type: "card", limit: [5, "EUR"] },
						receipts: [
							{
								id: "e",
								total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
								date: "2022-01-01T00:00:42Z",
								original: "https://example.com/receipt.pdf",
							},
						],
						transactions: [
							{
								id: "3",
								purchaseId: "y",
								date: {
									payment: "2022-01-01T00:00:42Z",
									transaction: "2022-01-02T00:00:42Z",
								},
								descriptor: "something",
								reference: "someId",
								amount: [10, "USD"],
								balance: [-10, "EUR"],
							},
						],
					},
				],
			},
			{
				id: "abcd0004",
				from: "jane@example.com",
				created: "2021-12-28T13:37:42Z",
				modified: "2021-12-20T13:37:42Z",
				to: ["richard@example.com"],
				costCenter: "IT",
				purpose: "Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						from: "jane@example.com",
						costCenter: "IT",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						purpose: "Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								from: "jane@example.com",
								costCenter: "IT",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
								purpose: "Partial company budget",
								amount: [1000, "EUR"],
								delegations: [],
								purchases: [],
							},
						],
						purchases: [],
					},
				],
				purchases: [],
			},
		],
		purchases: [],
	}
	it("is", () => {
		expect(issuefab.Transaction.is(transaction)).toEqual(true)
	})
	it("create", () => {
		let result: issuefab.Transaction = issuefab.Transaction.create(creatable, "id")
		expect(issuefab.Transaction.is(result)).toEqual(true)
		expect(result.id == result.reference).toEqual(true)
		result = issuefab.Transaction.create({ ...creatable, reference: "reference" }, "id")
		expect(issuefab.Transaction.is(result)).toEqual(true)
		expect(result.id == result.reference).toEqual(false)
	})
	it("linking", () => {
		const purchase: issuefab.Purchase = {
			id: "aoeu1234",
			created: "2022-01-01T00:00:42Z",
			modified: "2022-01-01T00:00:42Z",
			buyer: "richard@example.com",
			amount: [30, "EUR"],
			purpose: "Production Workers",
			email: "receipt@example.com",
			payment: { type: "card", limit: [100, "EUR"] },
			receipts: [
				{
					id: "1",
					total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
				{
					id: "2",
					total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
				{
					id: "3",
					total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
			],
			transactions: [
				{
					id: "c",
					reference: "someid",
					purchaseId: "y",
					amount: [10, "EUR"],
					descriptor: "irelevant",
					date: { transaction: "2022-01-01T00:00:42Z" },
					balance: [-10, "EUR"],
				},
				{
					id: "b",
					reference: "someid",
					purchaseId: "y",
					amount: [10, "EUR"],
					descriptor: "irelevant",
					date: { transaction: "2022-01-01T00:00:42Z" },
					balance: [-10, "EUR"],
				},
				{
					id: "a",
					reference: "someid",
					purchaseId: "y",
					amount: [10, "EUR"],
					descriptor: "irelevant",
					date: { transaction: "2022-01-01T00:00:42Z" },
					balance: [-10, "EUR"],
				},
			],
		}
		const remainder = issuefab.Transaction.link(
			[
				{ receiptId: "1", transactionId: "a" },
				{ receiptId: "2", transactionId: "b" },
				{ receiptId: "4", transactionId: "d" },
			],
			purchase
		)
		expect(remainder).toEqual([{ receiptId: "4", transactionId: "d" }])
		expect(purchase.transactions[0].receiptId).toEqual(undefined)
		expect(purchase.transactions[1].receiptId).toEqual("2")
		expect(purchase.transactions[2].receiptId).toEqual("1")
		expect(purchase.receipts[0].transactionId).toEqual("a")
		expect(purchase.receipts[1].transactionId).toEqual("b")
		expect(purchase.receipts[2].transactionId).toEqual(undefined)
	})
	it("find", () => {
		expect(issuefab.Transaction.find(delegation.delegations, "3")).toEqual({
			root: delegation.delegations[0],
			purchase: delegation.delegations[0].purchases[0],
			found: delegation.delegations[0].purchases[0].transactions[0],
		})
	})
	it("list", () => {
		expect(issuefab.Transaction.list([delegation]).length).toEqual(3)
		expect(issuefab.Transaction.list([delegation], (_, __, d) => d.costCenter == "IT").length).toEqual(3)
		expect(issuefab.Transaction.list([delegation], t => t.amount[0] < 10).length).toEqual(1)
		expect(issuefab.Transaction.list([delegation], (_, p) => p.buyer == "richard@example.com").length).toEqual(2)
		const result = issuefab.Transaction.list(
			[delegation],
			(_, p) => p.buyer == "richard@example.com",
			(t, p, d) => ({ ...t, purchaseId: p.id, delegationId: d.id })
		)
		expect(result.length).toEqual(2)
		expect(
			result.every(
				transaction => issuefab.Transaction.is(transaction) && transaction.purchaseId && transaction.delegationId
			)
		)
	})
})

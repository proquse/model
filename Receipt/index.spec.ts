import * as fs from "fs/promises"
import { Blob, File } from "web-file-polyfill"
import * as model from "../index"
globalThis.Blob = Blob
globalThis.File = File

describe("Receipt", () => {
	const receipt: model.Receipt = {
		id: "asd",
		original: "https://example.com/receipt.pdf",
		total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
		date: "2022-01-01T00:00:42Z",
	}
	const delegation: model.Delegation = {
		id: "abcd0001",
		from: "jane@example.com",
		costCenter: "budget",
		created: "2021-12-20T13:37:42Z",
		modified: "2021-12-20T13:37:42Z",
		to: ["john@example.com"],
		purpose: "Purchase Total company Budget",
		amount: [20000, "EUR"],
		delegations: [
			{
				id: "abcd0002",
				from: "jane@example.com",
				created: "2021-12-22T13:37:42Z",
				modified: "2021-12-22T13:37:42Z",
				to: ["mary@example.com"],
				costCenter: "IT",
				purpose: "Purchase hosting costs",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0003",
						from: "jane@example.com",
						created: "2021-12-28T13:37:42Z",
						modified: "2021-12-28T13:37:42Z",
						to: ["richard@example.com"],
						costCenter: "IT",
						purpose: "Purchase Cloudflare",
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
								purpose: "Purchase Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [
									{
										id: "q",
										total: [{ net: [10, "USD"], vat: [0, "USD"] }],
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
								purpose: "Purchase Production Workers",
								payment: { type: "card", limit: [10, "EUR"] },
								receipts: [
									{
										id: "w",
										total: [{ net: [6, "USD"], vat: [3, "USD"] }],
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
						purpose: "Purchase Production Workers",
						payment: { type: "card", limit: [5, "EUR"] },
						receipts: [
							{
								id: "e",
								total: [{ net: [7.5, "USD"], vat: [2.5, "USD"] }],
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
				purpose: "Purchase Cloudflare",
				amount: [2000, "EUR"],
				delegations: [
					{
						id: "abcd0005",
						from: "jane@example.com",
						costCenter: "IT",
						created: "2021-12-20T13:37:42Z",
						modified: "2021-12-20T13:37:42Z",
						to: ["john@example.com", "jane@example.com"],
						purpose: "Purchase Partial company budget",
						amount: [1000, "EUR"],
						delegations: [
							{
								id: "abcd0006",
								from: "jane@example.com",
								costCenter: "IT",
								created: "2021-12-20T13:37:42Z",
								modified: "2021-12-20T13:37:42Z",
								to: ["mary@example.com"],
								purpose: "Purchase Partial company budget",
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
		expect(model.Receipt.is(receipt)).toEqual(true)
	})
	it("validate", () => {
		const now = "2022-01-01T00:00:42Z"
		expect(
			model.Receipt.validate(
				{
					id: "id",
					total: [{ net: [10, "EUR"], vat: [2, "EUR"] }],
					date: now,
					original: "https://example.com/receipt.pdf",
				},
				"EUR"
			)
		).toEqual(true)
		expect(
			model.Receipt.validate(
				{
					id: "id",
					total: [{ net: [10, "EUR"], vat: [2, "EUR"] }],
					date: now,
					original: "https://example.com/receipt.pdf",
				},
				"USD"
			)
		).toEqual(false)
		expect(
			model.Receipt.validate(
				{
					id: "id",
					total: [{ net: [10, "EUR"], vat: [2, "USD"] }],
					date: now,
					original: "https://example.com/receipt.pdf",
				},
				"EUR"
			)
		).toEqual(false)
		expect(
			model.Receipt.validate(
				{ id: "id", total: [{ net: [10, "EUR"], vat: [2, "EUR"] }], date: now, original: "" },
				"EUR"
			)
		).toEqual(false)
	})
	it("find", () => {
		expect(model.Receipt.find([delegation], "w")).toEqual({
			root: delegation,
			delegation: delegation.delegations[0].delegations[0],
			purchase: delegation.delegations[0].delegations[0].purchases[1],
			found: delegation.delegations[0].delegations[0].purchases[1].receipts[0],
		})
		expect(model.Receipt.find([delegation], "q")).not.toEqual(undefined)
		expect(model.Receipt.find([delegation], "e")).not.toEqual(undefined)
	})
	it("list", () => {
		expect(model.Receipt.list([delegation]).length).toEqual(3)
		expect(model.Receipt.list(delegation.delegations, (_, __, d) => d.costCenter == "IT").length).toEqual(3)
		expect(model.Receipt.list([delegation], (_, p) => p.buyer == "mary@example.com").length).toEqual(1)
		expect(
			model.Receipt.list(
				[delegation],
				r => r.total.reduce((total, { net: [net], vat: [vat] }) => total + net + vat, 0) >= 10
			).length
		).toEqual(2)
		const result = model.Receipt.list(
			[delegation],
			r => r.total.reduce((total, { net: [net], vat: [vat] }) => total + net + vat, 0) < 10,
			(r, p, d) => ({ ...r, purchaseId: p.id, delegationId: d.id })
		)
		expect(result.length).toEqual(1)
		expect(result.every(receipt => model.Receipt.is(receipt) && receipt.purchaseId && receipt.delegationId)).toEqual(
			true
		)
	})

	async function createBufferFromFile(filePath: string): Promise<Buffer> {
		return await fs.readFile(filePath)
	}

	it("compile", async () => {
		const receiptA = new File([await createBufferFromFile("./Receipt/receiptA.pdf")], "ReceiptA.pdf", {
			type: "application/pdf",
		})
		const receiptB = new File([await createBufferFromFile("./Receipt/receiptB.pdf")], "ReceiptB.pdf", {
			type: "application/pdf",
		})
		const receiptC = new File([await createBufferFromFile("./Receipt/receiptC.jpg")], "ReceiptC.jpg", {
			type: "image/jpeg",
		})
		const receiptD = new File([await createBufferFromFile("./Receipt/receiptD.jpg")], "ReceiptD.jpg", {
			type: "image/jpeg",
		})
		const receiptE = new File([await createBufferFromFile("./Receipt/receiptE.png")], "ReceiptE.png", {
			type: "image/png",
		})
		const receiptF = new File([await createBufferFromFile("./Receipt/receiptF.pdf")], "ReceiptF.pdf", {
			type: "application/pdf",
		})
		const purchase: model.Purchase = {
			id: "aoeu1234",
			created: "2022-01-01T00:00:42Z",
			modified: "2022-01-01T00:00:42Z",
			buyer: "richard@example.com",
			amount: [9.5, "EUR"],
			purpose: "Purchase Production Workers",
			email: "receipt@example.com",
			payment: { type: "card", limit: [10, "EUR"] },
			receipts: [
				{
					id: "id",
					total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
					date: "2022-01-01T00:00:42Z",
					original: "https://example.com/receipt.pdf",
				},
			],
			transactions: [],
		}
		const receiptsData: {
			costCenter: string
			receipts: { details: model.Receipt; file: File; purchase: model.Purchase }[]
		}[] = [
			{
				costCenter: "Sales",
				receipts: [
					{
						details: {
							id: "AAAA",
							original: "placeholder",
							total: [{ net: [990, "EUR"], vat: [10, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptF,
						purchase: { ...purchase, purpose: "Purchase 1" },
					},
					{
						details: {
							id: "BBBB",
							original: "placeholder",
							total: [{ net: [1327, "EUR"], vat: [20, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptB,
						purchase: { ...purchase, purpose: "Purchase 2" },
					},
					{
						details: {
							id: "CCCC",
							original: "placeholder",
							total: [{ net: [1327, "EUR"], vat: [30, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptC,
						purchase: { ...purchase, purpose: "Purchase 3" },
					},
					{
						details: {
							id: "DDDD",
							original: "placeholder",
							total: [{ net: [1327, "EUR"], vat: [40, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptD,
						purchase: { ...purchase, purpose: "Purchase 4" },
					},
				],
			},
			{
				costCenter: "Marketing",
				receipts: [
					{
						details: {
							id: "AAAA",
							original: "placeholder",
							total: [{ net: [11110, "EUR"], vat: [1000, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptA,
						purchase: { ...purchase, purpose: "Purchase 5" },
					},
					{
						details: {
							id: "BBBB",
							original: "placeholder",
							total: [{ net: [1327000, "EUR"], vat: [10, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptB,
						purchase: { ...purchase, purpose: "Purchase 6" },
					},
				],
			},
			{
				costCenter: "Cars",
				receipts: [
					{
						details: {
							id: "AAAA",
							original: "placeholder",
							total: [{ net: [111101, "EUR"], vat: [1000, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptA,
						purchase: { ...purchase, purpose: "Purchase 7" },
					},
					{
						details: {
							id: "BBBB",
							original: "placeholder",
							total: [{ net: [13200, "EUR"], vat: [10, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptB,
						purchase: { ...purchase, purpose: "Purchase 8" },
					},
					{
						details: {
							id: "BBBB",
							original: "placeholder",
							total: [{ net: [130, "EUR"], vat: [10, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptB,
						purchase: { ...purchase, purpose: "Purchase 9" },
					},
					{
						details: {
							id: "BBBB",
							original: "placeholder",
							total: [{ net: [15500, "EUR"], vat: [10, "EUR"] }],
							date: "2022-09-20T13:37:42Z",
						},
						file: receiptE,
						purchase: { ...purchase, purpose: "Purchase 10" },
					},
				],
			},
		]
		const receiptResult = await model.Receipt.compile(receiptsData, "Issuefab AB", {
			start: "2022-09-19",
			end: "2022-09-21",
		})
		await fs.writeFile("./Receipt/receiptResult.pdf", receiptResult)
	})
})

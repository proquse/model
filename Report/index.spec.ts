import * as fs from "fs/promises"
import { issuefab } from "../index"

async function createBufferFromFile(filePath: string): Promise<Buffer> {
	return await fs.readFile(filePath)
}

it("compile", async () => {
	const receiptA = new File([await createBufferFromFile("./testFiles/receiptA.pdf")], "ReceiptA.pdf", {
		type: "application/pdf",
	})
	const receiptB = new File([await createBufferFromFile("./testFiles/receiptB.pdf")], "ReceiptB.pdf", {
		type: "application/pdf",
	})
	const receiptC = new File([await createBufferFromFile("./testFiles/receiptC.jpg")], "ReceiptC.jpg", {
		type: "image/jpeg",
	})
	const receiptD = new File([await createBufferFromFile("./testFiles/receiptD.jpg")], "ReceiptD.jpg", {
		type: "image/jpeg",
	})
	const receiptE = new File([await createBufferFromFile("./testFiles/receiptE.png")], "ReceiptE.png", {
		type: "image/png",
	})
	const receiptF = new File([await createBufferFromFile("./testFiles/receiptF.pdf")], "ReceiptF.pdf", {
		type: "application/pdf",
	})
	const purchase: issuefab.Purchase = {
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
	const receiptData: {
		costCenter: string
		receipts: { details: issuefab.Receipt; file: File; purchase: issuefab.Purchase }[]
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
	const data: issuefab.Report.Creatable.Receipt = {
		receiptData,
		organization: "Issuefab AB",
		dateRange: {
			start: "2022-09-19",
			end: "2022-09-21",
		},
	}
	const receiptResult = await issuefab.Report.Receipt.compile(data)
	await fs.writeFile("./testFiles/receiptResult.pdf", receiptResult)
})

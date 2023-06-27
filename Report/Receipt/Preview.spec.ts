import { issuefab } from "../../index"
import { Preview } from "./Preview"

describe("receipt Preview", () => {
	const dummyPreview: Preview = {
		costCenters: [
			{
				costCenter: {
					id: "1",
					amount: [10, "USD"],
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "description",
					delegations: [],
					costCenters: [],
				},
				receipts: [
					{
						receipt: {
							id: "receiptId",
							original: "https://example.com/receipt.pdf",
							total: [{ net: [10, "USD"], vat: [2.5, "USD"] }],
							date: "2022-01-01T00:00:42Z",
						},
						purchase: {
							id: "aoeu1234",
							created: "2022-01-01T00:00:42Z",
							modified: "2022-01-01T00:00:42Z",
							buyer: "richard.stevensson@example.com",
							amount: [951221, "EUR"],
							purpose: "Production Workers",
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
						},
					},
				],
			},
		],
		organization: "Example Organization",
		dateRange: {
			start: "2022-01-01",
			end: "2022-01-31",
		},
	}

	it("is", () => {
		expect(issuefab.Report.Receipt.Preview.is(dummyPreview)).toEqual(true)
		expect(
			issuefab.Report.Receipt.Preview.is((({ organization, ...dummyPreview }) => dummyPreview)(dummyPreview))
		).toEqual(false)
	})
})

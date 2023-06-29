import { issuefab } from "../../index"

describe("receipt Preview", () => {
	const dummyPreview: issuefab.Report.Receipt.Preview = {
		costCenters: [
			{
				costCenter: {
					id: "11111111",
					amount: { cadence: "year", value: 10, currency: "USD", created: "2023-01-01" },
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
							total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
							date: "2022-01-01T00:00:42Z",
						},
						purchase: {
							id: "aoeu1234",
							created: "2022-01-01T00:00:42Z",
							modified: "2022-01-01T00:00:42Z",
							buyer: "richard.stevensson@example.com",
							purpose: "Production Workers",
							email: "receipt@example.com",
							payment: { type: "card", limit: { cadence: "month", value: 20, currency: "EUR", created: "2023-01-01" } },
							receipts: [
								{
									id: "id",
									total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
									date: "2022-01-01T00:00:42Z",
									original: "https://example.com/receipt.pdf",
								},
							],
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

import { proquse } from "../../index"

describe("receipt Preview", () => {
	const dummyPreview: proquse.Report.Receipt.Preview = {
		costCenters: [
			{
				costCenter: {
					id: "---c1---",
					amount: { interval: "year", value: 10, currency: "USD", created: "2023-01-01" },
					name: "Development",
					created: "2021-12-20T13:37:42Z",
					modified: "2022-12-20T13:37:42Z",
					from: "jessie@example.com",
					description: "description",
					type: "costCenter",
					usage: [],
				},
				receipts: [
					{
						receipt: {
							id: "---r1---",
							original: "https://example.com/receipt.pdf",
							total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
							date: "2022-01-01T00:00:42Z",
						},
						purchase: {
							id: "---p1---",
							created: "2022-01-01T00:00:42Z",
							modified: "2022-01-01T00:00:42Z",
							buyer: "richard.stevensson@example.com",
							purpose: "Production Workers",
							email: "receipt@example.com",
							type: "purchase",
							payment: {
								type: "card",
								limit: { interval: "month", value: 20, currency: "EUR", created: "2023-01-01" },
								mask: "012345******6789",
								expires: { month: 4, year: 24 },
								reference: "reference",
							},
							transactions: [],
							receipts: [
								{
									id: "---r1---",
									original: "https://example.com/receipt.pdf",
									total: [{ net: { value: 10, currency: "USD" }, vat: { value: 2.5, currency: "USD" } }],
									date: "2022-01-01T00:00:42Z",
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
		expect(proquse.Report.Receipt.Preview.is(dummyPreview)).toEqual(true)
		expect(
			proquse.Report.Receipt.Preview.is((({ organization, ...dummyPreview }) => dummyPreview)(dummyPreview))
		).toEqual(false)
	})
})

import { proquse } from "../index"

describe("Warning", () => {
	it("is", () => {
		const warning: proquse.Warning.Overallocation = {
			type: "overallocation",
			severity: 0,
			source: "resource-id",
			days: 123,
			message: "resource overallocated in 123 days.",
		}
		const warnings: proquse.Warning[] = [
			warning,
			{ type: "overspent", severity: 1, source: "resource-id" },
			{ type: "missing-receipt", severity: 2, source: "resource-id" },
		]
		warnings.forEach(warning => expect(proquse.Warning.is(warning)).toEqual(true))
		expect(proquse.Warning.is((({ days: _, ...warning }) => warning)(warning))).toEqual(false)
	})
	it("warnings function", () => {
		const costCenter: proquse.CostCenter = {
			from: "jessie@rocket.com",
			name: "Development",
			amount: { value: 5000, currency: "EUR", interval: "single", created: "2024-04-22" },
			id: "------c1",
			created: "2024-04-22T07:50:56.564Z",
			modified: "2024-04-22T07:50:56.564Z",
			usage: [
				{
					from: "jessie@rocket.com",
					to: ["jessie@rocket.com"],
					purpose: "Hosting",
					amount: { value: 2500, currency: "EUR", interval: "single", created: "2024-04-22" },
					costCenter: "Development",
					id: "----d1c1",
					created: "2024-04-22T07:53:09.776Z",
					modified: "2024-04-22T07:53:09.776Z",
					usage: [
						{
							purpose: "Domain",
							payment: {
								type: "card",
								limit: { value: 15, currency: "GBP", interval: "single", created: "2024-04-22" },
								rates: { EUR: 1.1620947920721894 },
								reference: "modulr|V500014TS4",
								mask: "500184******3096",
								expires: { month: 5, year: 24 },
								holder: "Rocket AB",
							},
							buyer: "jessie@rocket.com",
							id: "--p1d1c1",
							type: "purchase",
							email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
							created: "2024-04-22T08:37:34.912Z",
							modified: "2024-04-22T08:37:34.912Z",
							receipts: [],
							transactions: [],
						},
						{
							from: "jessie@rocket.com",
							to: ["jessie@rocket.com"],
							purpose: "Pi",
							amount: { value: 70, currency: "EUR", interval: "single", created: "2024-04-23" },
							costCenter: "Development",
							id: "--d1d1c1",
							created: "2024-04-23T07:17:44.680Z",
							modified: "2024-04-23T07:17:44.680Z",
							usage: [
								{
									purpose: "Pi",
									payment: {
										type: "card",
										limit: { value: 50, currency: "GBP", interval: "single", created: "2024-04-23" },
										rates: { EUR: 1.1620947920721894 },
										reference: "modulr|V500014UDV",
										mask: "500184******6539",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "p1d1d1c1",
									type: "purchase",
									email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
									created: "2024-04-23T08:40:02.203Z",
									modified: "2024-04-24T07:56:26.126Z",
									receipts: [],
									transactions: [
										{
											receipts: [],
											reference: "729691",
											card: { reference: "modulr|V500014UDV" },
											merchant: { descriptor: "merchant", country: "GB", category: "5000" },
											operations: [
												{
													type: "capture",
													reference: "aaaaaaaa",
													amount: {
														account: { value: 50, currency: "GBP" },
														merchant: { value: 50, currency: "GBP" },
														rate: 1,
													},
													status: "success",
													modified: "2024-04-26T02:00:02.000Z",
													created: "2024-04-26T02:00:02.000Z",
												},
											],
											status: "finalized",
											amount: { value: 50, currency: "GBP" },
											modified: "2024-04-26T02:00:02.000Z",
											created: "2024-04-26T02:00:02.000Z",
										},
									],
								},
								{
									purpose: "Hat",
									payment: {
										type: "card",
										limit: { value: 15, currency: "GBP", interval: "single", created: "2024-04-22" },
										rates: { EUR: 1.1620947920721894 },
										reference: "modulr|V500014TS4",
										mask: "500184******3096",
										expires: { month: 5, year: 24 },
										holder: "Rocket AB",
									},
									buyer: "jessie@rocket.com",
									id: "yyLB9lB9",
									type: "purchase",
									email: "receipt+aaaaaaaa_bbbbbbbb@proquse.com",
									created: "2024-04-24T09:05:31.860Z",
									modified: "2024-04-29T12:32:59.220Z",
									receipts: [],
									transactions: [],
								},
							],
							type: "delegation",
						},
					],
					type: "delegation",
				},
			],
			type: "costCenter",
		}
		const all: proquse.Warning[] = []
		const {
			"------c1": c1,
			"----d1c1": d1c1,
			"--p1d1c1": p1d1c1,
			"--d1d1c1": d1d1c1,
			p1d1d1c1,
		} = proquse.CostCenter.warnings(costCenter, "2024-05-02", warning => all.push(warning))
		expect(all.length).toEqual(2)
		expect(all).toEqual(Array.from(new Set(all)))
		expect(c1).not.toBeUndefined()
		expect(d1c1).not.toBeUndefined()
		expect(p1d1c1).not.toBeUndefined()
		expect(d1d1c1).not.toBeUndefined()
		expect(p1d1d1c1).not.toBeUndefined()
		expect(
			!p1d1d1c1?.value.some(
				warning => !d1d1c1?.child.includes(warning) || !d1c1?.child.includes(warning) || !c1?.child.includes(warning)
			)
		).toEqual(true)
		expect(!d1d1c1?.value.some(warning => !d1c1?.child.includes(warning) || !c1?.child.includes(warning))).toEqual(true)
		expect(!d1c1?.value.some(warning => !c1?.child.includes(warning))).toEqual(true)
	})
})

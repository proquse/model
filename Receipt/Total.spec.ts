import { issuefab } from "../index"

describe("Receipt.Total", () => {
	it("is", () => {
		const total: issuefab.Receipt.Total = {
			net: { value: 10, currency: "EUR" },
			vat: { value: 2.5, currency: "EUR" },
		}
		expect(issuefab.Receipt.Total.is(total)).toEqual(true)
		expect(issuefab.Receipt.Total.is((({ net, ...total }) => total)(total))).toEqual(false)
		expect(issuefab.Receipt.Total.is((({ vat, ...total }) => total)(total))).toEqual(false)
	})
})

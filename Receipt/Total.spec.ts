import { proquse } from "../index"

describe("Receipt.Total", () => {
	it("is", () => {
		const total: proquse.Receipt.Total = {
			net: { value: 10, currency: "EUR" },
			vat: { value: 2.5, currency: "EUR" },
		}
		expect(proquse.Receipt.Total.is(total)).toEqual(true)
		expect(proquse.Receipt.Total.is((({ net, ...total }) => total)(total))).toEqual(false)
		expect(proquse.Receipt.Total.is((({ vat, ...total }) => total)(total))).toEqual(false)
	})

	it("spent", () => {
		const total: proquse.Receipt.Total = {
			net: { value: 10, currency: "EUR" },
			vat: { value: 25, currency: "EUR" },
		}

		expect(proquse.Receipt.Total.spent(total, total.net.currency)).toEqual(35)
	})
})

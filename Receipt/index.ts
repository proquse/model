import * as cryptly from "cryptly"
import * as isoly from "isoly"
import * as PDFLib from "pdf-lib"
import { Delegation } from "../Delegation"
import { Purchase } from "../Purchase"
import { Transaction } from "../Transaction"
import { Creatable as CreatableRequest } from "./Creatable"
import { Total as ReceiptTotal } from "./Total"
export interface Receipt {
	id: cryptly.Identifier
	original: string
	total: ReceiptTotal[]
	date: isoly.DateTime
	transactionId?: string
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			isoly.DateTime.is(value.date) &&
			cryptly.Identifier.is(value.id) &&
			typeof value.original == "string" &&
			Array.isArray(value.total) &&
			value.total.every(ReceiptTotal.is) &&
			(value.transactionId == undefined || typeof value.transactionId == "string")
		)
	}
	function findInner<T, S>(elements: T[], finder: (element: T) => S | undefined): S | undefined {
		let result: S | undefined
		elements.find(single => (result = finder(single)))
		return result
	}
	export function find(
		roots: Delegation[],
		id: string
	): { root: Delegation; purchase: Purchase; found: Receipt } | undefined {
		return findInner(roots, root => {
			let result = findInner(root.purchases, purchase =>
				findInner(purchase.receipts, receipt =>
					receipt.id != id ? undefined : { root: root, purchase: purchase, found: receipt }
				)
			)
			return result ?? ((result = find(root.delegations, id)) && { ...result, root: root })
		})
	}
	export function list<T = Receipt>(
		roots: Iterable<Delegation>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any,
		map?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => T
	): T[] {
		function* list(roots: Iterable<Delegation>): Generator<T> {
			for (const root of roots) {
				for (const purchase of root.purchases) {
					for (const receipt of purchase.receipts) {
						;(!filter || filter(receipt, purchase, root)) && (yield map ? map(receipt, purchase, root) : (receipt as T))
					}
				}
				yield* list(root.delegations)
			}
		}
		return Array.from(list(roots))
	}
	export function validate(receipt: Receipt, currency?: isoly.Currency): boolean {
		return (
			!!receipt.id &&
			!!receipt.original &&
			receipt.date < isoly.DateTime.now() &&
			(!receipt.total.length || !currency || receipt.total.every(total => Total.validate(total, currency))) &&
			receipt.transactionId != ""
		)
	}
	export async function compile(
		receiptData: { costCenter: string; receipts: { details: Receipt; file: Uint8Array }[] }[],
		organisation: string,
		dateRange: isoly.DateRange
	): Promise<Uint8Array> {
		let result: Uint8Array | undefined = undefined
		const pdfDoc = await PDFLib.PDFDocument.create()
		const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Courier)
		pdfDoc.setAuthor("Issuefab AB")
		pdfDoc.setCreationDate(new Date())
		const width = PDFLib.PageSizes.A4[0]
		let height = PDFLib.PageSizes.A4[1]
		const fontSize = 12
		const headerSize = Math.round(fontSize * 1.33)
		const xMargin = 30
		const yMargin = 4 * fontSize
		const cellWidth = 90
		const lineHeight = 15
		const lineThickness = 1
		const lineMargin = 1
		const headers = ["Page", "Vat", "Net", "Gross", "Currency"]
		const receiptsPerIndexPage = (height - 2 * yMargin - fontSize / 2) / lineHeight
		const ccStartPage: Record<string, number> = {}
		const frontPage = pdfDoc.addPage([width, height])
		const indexPages = Array.from({
			length: Math.ceil(
				receiptData.reduce((total, costCenter) => total + costCenter.receipts.length, 0) / receiptsPerIndexPage
			),
		}).map((_, pageNumber) =>
			receiptData.slice(pageNumber * receiptsPerIndexPage, (pageNumber + 1) * receiptsPerIndexPage)
		)

		for (const [i, indexPage] of indexPages.entries()) {
			for (const CostCenter of indexPage) {
				const page = pdfDoc.addPage([width, height])
				page.drawText(`Summary for cost center: ${CostCenter.costCenter}`, { x: xMargin, y: height - yMargin })
				ccStartPage[CostCenter.costCenter] = pdfDoc.getPageCount()
				height -= 20
				headers.forEach((header, index) =>
					page.drawText(header, {
						x: xMargin + index * cellWidth,
						y: height - yMargin,
						size: headerSize,
					})
				)
				page.moveTo(xMargin, height - yMargin - fontSize / 2)
				page.drawLine({
					start: { x: xMargin, y: height - yMargin - lineThickness - lineMargin },
					end: { x: width - xMargin, y: height - yMargin - lineThickness - lineMargin },
					thickness: lineThickness,
				})

				for (const receipt of CostCenter.receipts) {
					const currency = receipt.details.total[0].net[1]
					const [net, vat] = receipt.details.total.reduce<[number, number]>(
						([n, v], { net: [net], vat: [vat] }) => [n + net, v + vat],
						[0, 0]
					)
					const cellText = [
						`${pdfDoc.getPageCount() + indexPages.length - i}`,
						`${vat} `,
						`${net}`,
						`${net + vat}`,
						currency,
					]
					page.moveDown(lineHeight)
					cellText.forEach((text, index) => {
						page.drawText(text, {
							x: xMargin + index * cellWidth,
							size: fontSize,
							font: font,
						})
					})
					const newFile = await PDFLib.PDFDocument.load(receipt.file)
					const copiedPages = await pdfDoc.copyPages(newFile, newFile.getPageIndices())
					copiedPages.forEach(page => {
						pdfDoc.addPage(page)
					})
				}
			}
		}

		frontPage.drawText(`Invoice summary: ${organisation}`, {
			x: xMargin,
			y: (height * 2) / 3,
			size: headerSize,
		})

		frontPage.drawText(`${dateRange.start} - ${dateRange.end}`, {
			x: xMargin,
			y: (height * 2) / 3 - lineHeight,
			size: fontSize,
		})
		frontPage.moveDown(lineHeight * 50)
		;["Cost center", "Pages", "Vat", "Net", "Gross", "Currency"].forEach((header, index) =>
			frontPage.drawText(header, {
				x: xMargin + index * cellWidth,
				y: height / 2,
				size: 16,
			})
		)
		frontPage.moveTo(xMargin, height / 2 - fontSize / 2)
		frontPage.drawLine({
			start: { x: xMargin, y: height / 2 - lineThickness - lineMargin },
			end: { x: width - xMargin, y: height / 2 - lineThickness - lineMargin },
			thickness: lineThickness,
		})

		for (const costCenter of receiptData) {
			const costCenterCurrency = costCenter.receipts[0].details.total[0].net[1]
			const [totalVat, totalNet] = costCenter.receipts.reduce(
				([vat, net], receipt) =>
					receipt.details.total.reduce(([v, n], { net: [net], vat: [vat] }) => [net + v, vat + n], [vat, net]),
				[0, 0]
			)
			const cellText = [
				`${costCenter.costCenter}`,
				`${ccStartPage[costCenter.costCenter]}`,
				`${totalVat}`,
				`${totalNet}`,
				`${totalNet + totalVat}`,
				`${costCenterCurrency}`,
			]
			frontPage.moveDown(lineHeight)
			cellText.forEach((text, index) => {
				frontPage.drawText(text, {
					x: xMargin + index * cellWidth,
					size: fontSize,
					font: font,
				})
			})
		}
		for (let i = 1; i <= pdfDoc.getPageCount(); i++) {
			pdfDoc.getPage(i).drawText(`${i}/${pdfDoc.getPageCount()}`, { x: 20, y: 20, size: 12 })
		}
		result = await pdfDoc.save()
		return result
	}
	export type Link = Transaction.Link
	export const link = Transaction.link
	export type Creatable = CreatableRequest
	export const Creatable = CreatableRequest
	export type Total = ReceiptTotal
	export const Total = ReceiptTotal
}

import * as cryptly from "cryptly"
import * as isoly from "isoly"
import * as PDFLib from "pdf-lib"
import { Amount } from "../Amount"
import { Delegation } from "../Delegation"
import { Purchase } from "../Purchase"
import { Transaction } from "../Transaction"
import { Creatable as ReceiptCreatable } from "./Creatable"
import { Request as ReceiptRequest } from "./Request"
export interface Receipt {
	id: cryptly.Identifier
	original: string
	amount: Amount
	date: isoly.DateTime
	vat: number
	transactionId?: string
}

export namespace Receipt {
	export function is(value: Receipt | any): value is Receipt & Record<string, any> {
		return (
			typeof value == "object" &&
			isoly.DateTime.is(value.date) &&
			cryptly.Identifier.is(value.id) &&
			typeof value.original == "string" &&
			Amount.is(value.amount) &&
			typeof value.vat == "number" &&
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
	export function validate(receipt: Receipt, limit?: Amount): boolean {
		return (
			!!receipt.id &&
			!!receipt.original &&
			receipt.date < isoly.DateTime.now() &&
			Amount.validate(receipt.amount, limit) &&
			receipt.amount[0] > 0 &&
			receipt.vat >= 0 &&
			receipt.vat <= 1 &&
			receipt.transactionId != ""
		)
	}

	export async function compile(
		receipts: { details: Receipt; file: Uint8Array }[],
		delegation: Delegation.Data,
		dateRange: isoly.DateRange
	): Promise<Uint8Array> {
		let result: Uint8Array | undefined = undefined
		const pdfDoc = await PDFLib.PDFDocument.create()
		const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Courier)
		pdfDoc.setAuthor("Issuefab AB")
		pdfDoc.setCreationDate(new Date())
		const [width, height] = PDFLib.PageSizes.A4
		const fontSize = 12
		const headerSize = Math.round(fontSize * 1.33)
		const xMargin = 30
		const yMargin = 4 * fontSize
		const cellWidth = 100
		const lineHeight = 15
		const lineThickness = 1
		const lineMargin = 1
		const headers = ["Page", "Vat", "Vat total", "Net", "Gross"]
		const receiptsPerIndexPage = (height - 2 * yMargin - fontSize / 2) / lineHeight

		const frontPage = pdfDoc.addPage([width, height])

		const indexPages = Array.from({ length: Math.ceil(receipts.length / receiptsPerIndexPage) }).map((_, pageNumber) =>
			receipts.slice(pageNumber * receiptsPerIndexPage, (pageNumber + 1) * receiptsPerIndexPage)
		)

		let vat = 0
		let totalVat = 0
		let totalNet = 0
		let totalGross = 0

		for (const [i, indexPage] of indexPages.entries()) {
			const page = pdfDoc.insertPage(1 + i, [width, height])
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
			for (const receipt of indexPage) {
				const cellText = [
					`${pdfDoc.getPageCount() + indexPages.length - i}`,
					`${receipt.details.vat * 100}%`,
					`${receipt.details.amount[0] * receipt.details.vat}`,
					`${receipt.details.amount[0] - receipt.details.amount[0] * receipt.details.vat}`,
					`${receipt.details.amount[0]}    ${receipt.details.amount[1]}`,
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
				copiedPages.forEach(page => pdfDoc.addPage(page))

				vat = vat + receipt.details.vat
				totalVat = isoly.Currency.add(
					receipt.details.amount[1],
					totalVat,
					isoly.Currency.multiply(receipt.details.amount[1], receipt.details.amount[0], receipt.details.vat)
				)
				;(totalNet = isoly.Currency.subtract(
					receipt.details.amount[1],
					isoly.Currency.add(receipt.details.amount[1], totalNet, receipt.details.amount[0]),
					isoly.Currency.multiply(receipt.details.amount[1], receipt.details.amount[0], receipt.details.vat)
				)),
					(totalGross = isoly.Currency.add(receipt.details.amount[1], totalGross, receipt.details.amount[0]))
			}
		}

		frontPage.drawText(`Invoice summary: ${delegation.costCenter}`, {
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
		;["Pages", "Vat", "Vat total", "Net", "Gross"].forEach((header, index) =>
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
		const cellText = [
			`${pdfDoc.getPageCount()}`,
			`${(vat / receipts.length) * 100}%`,
			`${totalVat}`,
			`${totalNet}`,
			`${totalGross}    ${delegation.amount[1]}`,
		]
		frontPage.moveDown(lineHeight)
		cellText.forEach((text, index) => {
			frontPage.drawText(text, {
				x: xMargin + index * cellWidth,
				size: fontSize,
				font: font,
			})
		})

		result = await pdfDoc.save()
		return result
	}
	export const link = Transaction.link
	export type Link = Transaction.Link
	export const Creatable = ReceiptCreatable
	export type Creatable = ReceiptCreatable
	export const Request = ReceiptRequest
	export type Request = ReceiptRequest
}

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
	export function list(
		roots: Iterable<Delegation>,
		filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any
	): Receipt[] {
		function* list(
			roots: Iterable<Delegation>,
			filter?: (receipt: Receipt, purchase: Purchase, delegation: Delegation) => boolean | any
		): Generator<Receipt> {
			for (const root of roots) {
				for (const purchase of root.purchases) {
					for (const receipt of purchase.receipts) {
						;(!filter || filter(receipt, purchase, root)) && (yield receipt)
					}
				}
				yield* list(root.delegations, filter)
			}
		}
		return Array.from(list(roots, filter))
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

	export async function compile(receipts: { details: Receipt; file: Uint8Array }[]): Promise<Uint8Array | any> {
		let result: Uint8Array | undefined = undefined
		const pdfDoc = await PDFLib.PDFDocument.create()
		pdfDoc.setAuthor("Issuefab AB")
		//pdfDoc.setCreationDate()
		const indexPage = pdfDoc.addPage(PDFLib.PageSizes.A4)
		const { width, height } = indexPage.getSize()
		const fontsize = 12
		const font = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman)
		indexPage.moveTo(20, height - 4 * fontsize)
		receipts.map(async receipt => {
			indexPage.drawText(
				`${receipt.details.vat}\t 
				${receipt.details.amount[0] * receipt.details.vat}\t 
				${receipt.details.amount[0] - receipt.details.amount[0] * receipt.details.vat}\t 
				${receipt.details.amount}\n`,
				{ size: fontsize, font: font }
			)
			indexPage.moveDown(13)
			const newPages = await PDFLib.PDFDocument.load(receipt.file)
			pdfDoc.copyPages(newPages, newPages.getPageIndices())
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

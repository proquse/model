import { isly } from "isly"
import * as PDFLib from "pdf-lib"
import { Creatable as ExpenseCreatable } from "./Creatable"

export interface Expense {
	file: Uint8Array
}

export namespace Expense {
	export const type = isly.object<Expense>({
		file: isly.fromIs<Uint8Array>("Uint8Array", value => value instanceof Uint8Array),
	})
	export async function compile(data: ExpenseCreatable): Promise<Uint8Array> {
		let result: Uint8Array | undefined = undefined
		const pdfDocument = await PDFLib.PDFDocument.create()
		const font = await pdfDocument.embedFont(PDFLib.StandardFonts.Courier)
		pdfDocument.setAuthor("Issuefab AB")
		pdfDocument.setCreationDate(new Date())
		const width = PDFLib.PageSizes.A4[0]
		const height = PDFLib.PageSizes.A4[1]
		const fontSize = 12
		const headerSize = Math.round(fontSize * 1.33)
		const xMargin = 30
		const yMargin = 4 * fontSize
		const cellWidth = 220
		const lineHeight = 15
		const lineThickness = 1
		const lineMargin = 1
		const headers = ["Purpose", "Date", "Amount"]
		const frontPage = pdfDocument.addPage([width, height])

		frontPage.drawText(`Expense summary for: ${data.organization}`, {
			x: xMargin,
			y: (height * 2) / 3,
			size: headerSize,
		})
		frontPage.drawText(`${data.dateRange.start} - ${data.dateRange.end}`, {
			x: xMargin,
			y: (height * 2) / 3 - lineHeight,
			size: fontSize,
		})

		frontPage.moveTo(xMargin, height / 2 - fontSize / 2)
		frontPage.drawLine({
			start: { x: xMargin, y: height / 2 - lineThickness - lineMargin },
			end: { x: width - xMargin, y: height / 2 - lineThickness - lineMargin },
			thickness: lineThickness,
		})

		let page = addPage()
		addHeader(page)

		for (const user in data.compileData) {
			page.moveDown(lineHeight)
			let totalAmount = 0
			page.drawText(`User: ${user}`, {
				x: xMargin,
				size: fontSize,
				font: font,
			})

			for (const purchase of data.compileData[user]) {
				if (page.getY() < yMargin) {
					page = addPage()
					addHeader(page)
				}
				totalAmount += purchase.amount[0]
				const cellText = [
					`${purchase.purpose}`,
					`${purchase.date.split("T")[0]}`,
					`${purchase.amount[0].toLocaleString()}`,
					`${purchase.amount[1]} `,
				]
				page.moveDown(lineHeight + 1)
				cellText.forEach((text, index) => {
					page.drawText(text, {
						x: index <= 2 ? xMargin + index * cellWidth : xMargin + index * cellWidth - 140,
						size: fontSize,
						font: font,
					})
				})
			}
			page.moveDown(lineHeight)
			page.drawText(`Total amount: ${totalAmount.toLocaleString()}`, {
				x: xMargin,
				size: fontSize,
				font: font,
			})
			page.moveDown(lineHeight)
		}

		function addPage(): PDFLib.PDFPage {
			return pdfDocument.addPage()
		}
		function addHeader(page: PDFLib.PDFPage) {
			page.moveTo(xMargin, height - yMargin - fontSize / 2)
			headers.forEach((header, index) => {
				page.drawText(header, {
					x: xMargin + index * cellWidth,
					y: height - yMargin,
					size: headerSize,
				})
			})
		}

		result = await pdfDocument.save()
		return result
	}
	export const is = type.is
	export const flaw = type.flaw
	export type Creatable = ExpenseCreatable
	export const Creatable = ExpenseCreatable
}

import { isly } from "isly"
import * as PDFLib from "pdf-lib"
import { Creatable as ReceiptCreatable } from "./Creatable"

export interface Receipt {
	file: Uint8Array
}

export namespace Receipt {
	export const type = isly.object<Receipt>({
		file: isly.fromIs<Uint8Array>("Uint8Array", value => value instanceof Uint8Array),
	})
	export type Creatable = ReceiptCreatable
	export const Creatable = ReceiptCreatable

	export async function compile(data: ReceiptCreatable): Promise<Uint8Array> {
		let result: Uint8Array | undefined = undefined
		const pdfDocument = await PDFLib.PDFDocument.create()
		const font = await pdfDocument.embedFont(PDFLib.StandardFonts.Courier)
		pdfDocument.setAuthor("Issuefab AB")
		pdfDocument.setCreationDate(new Date())
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
		const costCenterStartPage: Record<string, number> = {}
		const frontPage = pdfDocument.addPage([width, height])
		const indexPages = Array.from({
			length: Math.ceil(
				data.receiptData.reduce((total, costCenter) => total + costCenter.receipts.length, 0) / receiptsPerIndexPage
			),
		}).map((_, pageNumber) =>
			data.receiptData.slice(pageNumber * receiptsPerIndexPage, (pageNumber + 1) * receiptsPerIndexPage)
		)

		for (const [i, indexPage] of indexPages.entries()) {
			for (const CostCenter of indexPage) {
				const page = pdfDocument.addPage([width, height])
				page.drawText(`Summary for cost center: ${CostCenter.costCenter}`, { x: xMargin, y: height - yMargin })
				costCenterStartPage[CostCenter.costCenter] = pdfDocument.getPageCount()
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
					// Costcenter summary
					const cellText = [
						`${pdfDocument.getPageCount() + indexPages.length - i}`,
						`${vat.toLocaleString()} `,
						`${net.toLocaleString()}`,
						`${(net + vat).toLocaleString()}`,
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

					//Start printing receipts
					const newFile = await PDFLib.PDFDocument.create()

					let dimensions: { width: number; height: number }
					let pageDimensions: { width: number; height: number }

					if (receipt.file.type == "application/pdf") {
						const pages = (await PDFLib.PDFDocument.load(await receipt.file.arrayBuffer())).getPages().length
						const embeddedPdf = await newFile.embedPdf(await receipt.file.arrayBuffer(), [...Array(pages).keys()])

						for (const embeddedPage of embeddedPdf) {
							const receiptPage = newFile.addPage()
							dimensions = embeddedPage.scale(1)
							pageDimensions = page.getSize()
							if (pageDimensions.width < dimensions.width || pageDimensions.height < dimensions.height) {
								dimensions = embeddedPage.scale(
									Math.min(
										(pageDimensions.width - 150) / dimensions.width,
										(pageDimensions.height - 150) / dimensions.height
									)
								)
							}
							receiptPage.drawText(`Purchase: ${receipt.purchase.purpose}`, {
								x: 15,
								y: page.getHeight() - 30,
								size: 12,
							})
							receiptPage.drawPage(embeddedPage, {
								x: page.getWidth() / 2 - dimensions.width / 2,
								y: page.getHeight() / 2 - dimensions.height / 2,
								width: dimensions.width,
								height: dimensions.height,
							})
						}
					}

					if (receipt.file.type == "image/jpeg" || receipt.file.type == "image/png") {
						const receiptPage = newFile.addPage()
						const image =
							receipt.file.type == "image/jpeg"
								? await newFile.embedJpg(await receipt.file.arrayBuffer())
								: await newFile.embedPng(await receipt.file.arrayBuffer())
						dimensions = image.scale(1)
						pageDimensions = receiptPage.getSize()
						if (pageDimensions.width < dimensions.width || pageDimensions.height < dimensions.height) {
							dimensions = image.scale(
								Math.min(
									(pageDimensions.width - 150) / dimensions.width,
									(pageDimensions.height - 150) / dimensions.height
								)
							)
						}

						receiptPage.drawText(`Purchase: ${receipt.purchase.purpose}`, {
							x: 15,
							y: page.getHeight() - 30,
							size: 12,
						})
						receiptPage.drawImage(image, {
							x: page.getWidth() / 2 - dimensions.width / 2,
							y: page.getHeight() / 2 - dimensions.height / 2,
							width: dimensions.width,
							height: dimensions.height,
						})
					}

					newFile.save()
					const copiedPages = await pdfDocument.copyPages(newFile, newFile.getPageIndices())
					copiedPages.forEach(page => {
						pdfDocument.addPage(page)
					})
				}
			}
		}

		frontPage.drawText(`Receipt summary: ${data.organization}`, {
			x: xMargin,
			y: (height * 2) / 3,
			size: headerSize,
		})
		frontPage.drawText(`${data.dateRange.start} - ${data.dateRange.end}`, {
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

		for (const costCenter of data.receiptData) {
			const costCenterCurrency = costCenter.receipts[0].details.total[0].net[1]
			const [totalVat, totalNet] = costCenter.receipts.reduce(
				([vat, net], receipt) =>
					receipt.details.total.reduce(([v, n], { net: [net], vat: [vat] }) => [net + v, vat + n], [vat, net]),
				[0, 0]
			)
			//Frontpage summary
			const cellText = [
				`${costCenter.costCenter}`,
				`${costCenterStartPage[costCenter.costCenter]}`,
				`${totalVat.toLocaleString()}`,
				`${totalNet.toLocaleString()}`,
				`${(totalNet + totalVat).toLocaleString()}`,
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
		result = await pdfDocument.save()
		return result
	}
}

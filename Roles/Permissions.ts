import { userwidgets } from "@userwidgets/model"
import { isly } from "isly"

export type Permissions = userwidgets.User.Permissions<Permissions.Proquse>
export namespace Permissions {
	export type Proquse = {
		delegation?: { create?: true; read?: true; edit?: true; view?: true } | true
		purchase?: { create?: true; read?: true; edit?: true; view?: true } | true
		costCenter?:
			| {
					root?: { create?: true; read?: true; edit?: true; view?: true } | true
					child?: { create?: true; read?: true; edit?: true; view?: true } | true
			  }
			| true
		reports?: true
		payment?: { expense?: true; prepaid?: true; card?: true } | true
		banking?: true
	}
	export namespace Proquse {
		export const type = isly.object<Permissions>({
			delegation: isly
				.object({
					create: isly.boolean(true).optional(),
					read: isly.boolean(true).optional(),
					edit: isly.boolean(true).optional(),
					view: isly.boolean(true).optional(),
				})
				.optional(),
			purchase: isly
				.object({
					create: isly.boolean(true).optional(),
					read: isly.boolean(true).optional(),
					edit: isly.boolean(true).optional(),
					view: isly.boolean(true).optional(),
				})
				.optional(),
			costCenter: isly
				.object({
					root: isly
						.object({
							create: isly.boolean(true).optional(),
							read: isly.boolean(true).optional(),
							edit: isly.boolean(true).optional(),
							view: isly.boolean(true).optional(),
						})
						.optional(),
					child: isly
						.object({
							create: isly.boolean(true).optional(),
							read: isly.boolean(true).optional(),
							edit: isly.boolean(true).optional(),
							view: isly.boolean(true).optional(),
						})
						.optional(),
				})
				.optional(),
			reports: isly.boolean(true).optional(),
			payment: isly
				.object({
					expense: isly.boolean(true).optional(),
					prepaid: isly.boolean(true).optional(),
					card: isly.boolean(true),
				})
				.optional(),
			banking: isly.boolean(true).optional(),
		})
		export const is = type.is
		export const flaw = type.flaw
		export const flags = [
			"delegation.create",
			"delegation.read",
			"delegation.edit",
			"delegation.view",
			"purchase.create",
			"purchase.read",
			"purchase.edit",
			"purchase.view",
			"costCenter.root.create",
			"costCenter.root.read",
			"costCenter.root.edit",
			"costCenter.root.view",
			"costCenter.child.create",
			"costCenter.child.read",
			"costCenter.child.edit",
			"costCenter.child.view",
			"reports",
			"payment.expense",
			"payment.prepaid",
			"payment.card",
			"banking",
		] as const
	}
	export const type = userwidgets.User.Permissions.type.create<Permissions>(Proquse.type)
	export const is = type.is
	export const flaw = type.flaw
	export const flags = Array.from(new Set([...userwidgets.User.Permissions.flags, ...Proquse.flags]))
}

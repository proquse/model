import * as model from "@userwidgets/model"

export namespace Roles {
	interface Permissions {
		"*"?: model.User.Permissions.Application
		[organizationId: string]: model.User.Permissions.Organization | undefined
	}
	const functions: Record<string, (permissions: Permissions, organizationId?: string) => boolean> = {
		user: satisfiesUser,
		financialController: satisfiesFinancialController,
	}

	export function satisfies(role: keyof typeof functions, permissions: Permissions, organizationId?: string) {
		return functions[role](permissions, organizationId)
	}

	function satisfiesFinancialController(permissions: Permissions, organizationId?: string): boolean {
		return (
			(!!permissions[organizationId ?? ""]?.user?.write || !!permissions["*"]?.user?.write) &&
			(!!permissions[organizationId ?? ""]?.user?.read || !!permissions["*"]?.user?.read) &&
			(!!permissions[organizationId ?? ""]?.organization?.write || !!permissions["*"]?.organization?.write) &&
			(!!permissions[organizationId ?? ""]?.organization?.read || !!permissions["*"]?.organization?.read) &&
			(!!permissions[organizationId ?? ""]?.banking?.write || !!permissions["*"]?.banking?.write) &&
			(!!permissions[organizationId ?? ""]?.banking?.read || !!permissions["*"]?.banking?.read) &&
			(!!permissions[organizationId ?? ""]?.delegation?.write || !!permissions["*"]?.delegation?.write) &&
			(!!permissions[organizationId ?? ""]?.delegation?.read || !!permissions["*"]?.delegation?.read)
		)
	}
	function satisfiesUser(permissions: Permissions, organizationId?: string): boolean {
		return !!permissions[organizationId ?? ""]?.user?.write || !!permissions["*"]?.user?.write
	}
}

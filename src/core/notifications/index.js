import { createNotificationSrvc } from './notifications.service.js'
import { templateRegistry } from './templates.helper.js'
import { log } from '../log/index.js'
/**
 *
 * @param {*} param0
 * @returns
 */
export const notify = async ({ users, template, kind = 'push', at = 'now', data }) => {
	log({ level: 'debug', message: 'notify', data: { users, template, kind, at, data } })
	let success = true
	if (!template && !template.slug) {
		throw 'templateSlug is required'
	}

	const templateFn = templateRegistry[template.slug]

	users.forEach((user) => {
		const { title, content } = templateFn({ user })
		createNotificationSrvc({ user, kind, at, title, content, template })
	})
	return success
}

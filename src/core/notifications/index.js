import { createNotificationSrvc } from './notifications.service.js'
import { templateRegistry } from './templates.helper.js'
import { log } from '../log/index.js'
/**
 *
 * @param {*} param0
 * @returns
 */
export const notify = async ({ user, kind = 'push', template, data = {} }) => {
	log({ level: 'debug', message: 'notify', data: { user, template, data } })
	if (!template && !template.slug) {
		throw 'templateSlug is required'
	}

	const templateFn = templateRegistry[template.slug]
	const { title, content } = templateFn({ user })
	createNotificationSrvc({ user, title, content, template, kind })
}

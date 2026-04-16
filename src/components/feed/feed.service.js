import { createFeedRepo, findFeedRepo } from './feed.repository.js'
import { log } from '../../core/log/index.js'

export const createFeedSrvc = async ({ targetData, targetResource, targetId, card }) => {
	log({ level: 'debug', message: 'createFeedSrvc' })
	return createFeedRepo({ targetData, targetResource, targetId, card })
}

export const findFeedSrvc = async ({ match, select, page, limit }) => {
	if (!select) select = '-state'
	limit = 50
	log({ level: 'debug', message: 'findFeedSrvc', data: { match, select, page, limit } })
	return findFeedRepo({ match, select, page, limit })
}

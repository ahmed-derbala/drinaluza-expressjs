import { errorHandler } from '../error/index.js'
import { findSessionsRepo, findOneSessionRepo } from './sessions.repository.js'
import { log } from '../log/index.js'

export const findSessionsSrvc = async ({ match, select }) => {
	try {
		const sessions = await findSessionsRepo({ match, select })
		return sessions
	} catch (err) {
		errorHandler({ err })
	}
}
export const findOneSessionSrvc = async ({ match }) => {
	return findOneSessionRepo({ match })
}

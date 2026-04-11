import { log } from '../log/index.js'
import { findSessionsRepo, findOneSessionRepo } from './sessions.repository.js'

export const findSessionsSrvc = async ({ match, select }) => {
	//log({ level: 'debug', message: 'findSessionsSrvc', data: { match, select } })
	return findSessionsRepo({ match, select })
}
export const findOneSessionSrvc = async ({ match }) => {
	//log({ level: 'debug', message: 'findOneSessionSrvc', data: { match } })
	return findOneSessionRepo({ match })
}

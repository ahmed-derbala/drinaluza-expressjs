import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo } from './shops.repository.js'
import config from '../../config/index.js'

export const findMyShopsSrvc = async ({ match, select, page, limit }) => {
	try {
		return UserModel.findOne({ $or }).select('+profile').lean()
	} catch (err) {
		errorHandler({ err })
	}
}

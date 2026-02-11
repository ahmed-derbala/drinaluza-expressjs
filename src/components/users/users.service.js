import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo, addShopToUserRepo, findMyProfileRepo, updateMyProfileRepo, findUsersRepo } from './users.repository.js'
import { createBusinessSrvc } from '../businesses/businesses.service.js'
import { customerSelect } from './schemas/customer.schema.js'
import { createFeedSrvc } from '../feed/feed.service.js'

export const updateMyProfileSrvc = async ({ user, newData }) => {
	if (newData.location && newData.location.sharingEnabled == false) {
		newData.location = {}
	}
	return updateMyProfileRepo({ user, newData })
}

export const findMyProfileSrvc = async ({ user }) => {
	const select = '+basicInfos +settings +address +location +contact +socialMedia +media'
	return findMyProfileRepo({ user, select })
}

export const findOneUserSrvc = async ({ match, select }) => {
	//log({ level: 'debug', data: { match, select } })
	return findOneUserRepo({ match, select })
}

export const findOneCustomerSrvc = async ({ match, select }) => {
	if (!select) {
		select = customerSelect
	}
	//log({ level: 'debug', data: { match, select } })
	let customer = await findOneUserRepo({ match, select })
	if (customer && customer.location && !customer.location.sharingEnabled) {
		customer.location = null
	}
	return customer
}

export const findUsersSrvc = async ({ match, select, page, limit, count }) => {
	//log({ level: 'debug', data: { match, select, page, limit, count }, label: 'findUsersSrvc' })
	return findUsersRepo({ match, select, page, limit, count })
}

export const findOneProfileSrvc = async ({ match }) => {
	const select = '+basicInfos +address'
	return findOneUserRepo({ match, select })
}

export const updateUserSrvc = async ({ match, newData }) => {
	return await updateUserRepo({ match, newData })
}

export const createUserSrvc = async ({ slug, name, role, contact, address, location, settings, media, socialMedia, basicInfos }) => {
	if (!slug && !name) return null
	const user = await createUserRepo({ slug, name, role, contact, address, location, settings, media, socialMedia, basicInfos })
	if (!user) return null
	if (user.role === 'shop_owner') {
		const business = await createBusinessSrvc({ owner: user })
		await addBusinessToUserSrvc({ business, user })
		createFeedSrvc({ targetData: user, targetResource: 'user', card: { kind: 'user' } })
	}
	return user
}

export const addShopToUserSrvc = async ({ shop, userId }) => {
	try {
		const updatedUser = await addShopToUserRepo({ shop, userId })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

export const addBusinessToUserSrvc = async ({ business, user }) => {
	return await updateUserRepo({ match: { _id: user._id }, newData: { business } })
}

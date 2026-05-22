import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo, addBusinessToUserRepo, findMyProfileRepo, updateMyProfileRepo, findUsersRepo } from './users.repository.js'
import { createBusinessSrvc, findOneBusinessSrvc } from '../businesses/businesses.service.js'
import { customerSelect } from './schemas/customer.schema.js'
import { createFeedSrvc } from '../feed/feed.service.js'
import { usersCollection } from './users.constant.js'
import { updateOneCardFeedRepo } from '../feed/feed.repository.js'
import { createPersonalDashboardSrvc } from '../dashboard/dashboard.service.js'

export const updateMyProfileSrvc = async ({ user, newData }) => {
	if (newData.location && newData.location.sharingEnabled == false) {
		newData.location = {}
	}
	const updatedProfile = await updateMyProfileRepo({ user, newData })
	//sync with feed
	const updatedFeedCard = await updateOneCardFeedRepo({ match: { targetId: user._id }, newData })
	console.log({ level: 'debug', message: 'updateMyProfileSrvc updatedFeedCard', data: { updatedFeedCard } })
	return updatedProfile
}

export const findMyProfileSrvc = async ({ user }) => {
	const select = '+basicInfos +settings +address +location +contact +socialMedia +media'
	return findMyProfileRepo({ user, select })
}

export const findOneUserSrvc = async ({ match, select }) => {
	select = select || '+basicInfos +settings +address +location +contact +socialMedia +media'
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
	if (user.role === 'business_owner') {
		/*let business=await findOneBusinessSrvc({owner:{slug:user.slug}})
		if(!business){
		 business = await createBusinessSrvc({ owner: user })
		}
				*/
		createFeedSrvc({ targetData: user, targetResource: usersCollection, targetId: user._id, card: { kind: 'user' } })
	}
	await createPersonalDashboardSrvc({ user, kind: 'personal' })
	return user
}

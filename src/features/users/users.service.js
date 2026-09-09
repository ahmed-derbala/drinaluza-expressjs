import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo, addBusinessToUserRepo, findMyProfileRepo, updateMyProfileRepo, findUsersRepo } from './users.repository.js'
import { createBusinessSrvc, findOneBusinessSrvc } from '../businesses/businesses.service.js'
import { customerSelect } from './schemas/customer.schema.js'
import { usersCollection } from './users.constant.js'
import { createPersonalDashboardSrvc } from '../dashboard/dashboard.service.js'
import { USER_ROLES, USER_ROLES_ALL } from '#users'

export const updateMyProfileSrvc = async ({ user, newData }) => {
	if (newData.location && newData.location.sharingEnabled == false) {
		newData.location = {}
	}
	const updatedProfile = await updateMyProfileRepo({ user, newData })
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

export const createUserSrvc = async ({ slug, name, roles, contact, address, location, settings, media, socialMedia, basicInfos }) => {
	if (!slug && !name) return null
	if (!name) name = { en: slug }
	if (!name.tn_latn) name.tn_latn = name.en
	if (!name.tn_arab) name.tn_arab = name.en
	if (!roles) roles = [USER_ROLES.customer]
	if (!settings) settings = {}
	if (!media) media = {}
	if (!socialMedia) socialMedia = {}
	if (!basicInfos) basicInfos = {}
	if (!contact) contact = {}
	if (!address) address = {}
	const user = await createUserRepo({ slug, name, roles, contact, address, location, settings, media, socialMedia, basicInfos })
	if (!user) return null
	await createPersonalDashboardSrvc({ user, kind: 'personal' })
	return user
}

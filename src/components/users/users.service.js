import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import mongoose from 'mongoose'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo } from './users.repository.js'
import config from '../../config/index.js'
const findOneUserSrvc = async ({ match, select }) => {
	try {
		//log({ level: 'debug', data: { match, select } })
		const fetchedUser = await findOneUserRepo({ match, select })
		return fetchedUser
	} catch (err) {
		errorHandler({ err })
	}
}
export const getUsers = async (params) => {
	return paginate({ model: UserModel })
		.then((users) => {
			return users
		})
		.catch((err) => errorHandler({ err }))
}
export const getProfile = async ({ loginId, userId, req }) => {
	try {
		log({ message: `requesting profile of userId=${userId} ...`, level: 'debug', req })
		if (!loginId) loginId = userId
		let $or = [{ email: loginId }, { username: loginId }, { 'phone.shortNumber': loginId }]
		if (mongoose.isValidObjectId(loginId)) $or.push({ _id: loginId })
		return UserModel.findOne({ $or }).select('+profile').lean()
	} catch (err) {
		errorHandler({ err })
	}
}
export const updateUserSrvc = async ({ identity, newData }) => {
	try {
		const updatedUser = await updateUserRepo({ identity, newData })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

export const createUserSrvc = async ({ email, username, phone, settings }) => {
	const signedupUser = await createUserRepo({ email, username, phone, settings })
	if (!signedupUser) return null
	return signedupUser
	/*if (profile && !profile.displayName) profile.displayName = `${profile.firstName} ${profile.lastName}`
    if (phone) {
        phone.countryCode = phone.countryCode.trim()
        phone.shortNUmber = phone.shortNumber.trim()
        phone.fullNumber = `${phone.countryCode}${phone.shortNumber}`
    }

    
    return createUserSrvc({ email,  })
        .then((createdUser) => {
            createdUser = createdUser.toJSON()
            if (createdUser.username == null) {
                return updateUserSrvc({ identity: { _id: createdUser._id }, newData: { username: createdUser._id } })
                    .then((updatedUser) => {
                        createdUser.username = createdUser._id
                        return createdUser
                    })
                    .catch((err) => errorHandler({ err }))
            }
            return createdUser
        })
        .catch((err) => errorHandler({ err }))
        */
}
export { findOneUserSrvc }

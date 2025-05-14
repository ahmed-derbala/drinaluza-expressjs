const { errorHandler } = require('../utils/error')
const { findOneUserSrvc } = require('../../components/users/users.service')
const bcrypt = require('bcrypt')

module.exports.signinSrvc = async ({ filter, password }) => {
	try {
		let user = await findOneUserSrvc({ filter, select: { _id: 1, password: 1 } })
		if (!user) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'no user found with that loginId', data: null, status: 409 }
		}
		//user found, check password
		const passwordCompare = bcrypt.compareSync(password, user.password)

		delete user.password //we dont need password anymore
		if (passwordCompare == false) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'password incorrect', data: null, status: 409 }
		}

		return user
	} catch (err) {
		errorHandler({ err })
	}
}

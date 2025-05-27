const { errorHandler } = require('../error')
const bcrypt = require('bcrypt')
const { createAuthRepo, findOneAuthRepo } = require(`./auth.repository`)
const config = require(`../../config`)

module.exports.signinSrvc = async ({ match, password }) => {
	try {
		//console.log(match, password)
		const fecthedAuth = await findOneAuthSrvc({ match, select: '+password' })

		if (!fecthedAuth) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'no user found with that loginId', data: null, status: 409 }
		}
		//user found, check password
		const passwordCompare = bcrypt.compareSync(password, fecthedAuth.password)
		delete fecthedAuth.password //we dont need password anymore

		if (passwordCompare == false) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'password incorrect', data: null, status: 409 }
		}

		return fecthedAuth
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createAuthSrvc = async ({ user, password }) => {
	try {
		const salt = bcrypt.genSaltSync(config.auth.saltRounds)
		password = bcrypt.hashSync(password, salt)
		const createdAuth = await createAuthRepo({ user, password })
		return createdAuth
	} catch (err) {
		errorHandler({ err })
	}
}

const findOneAuthSrvc = (module.exports.findOneAuthSrvc = async ({ match, select }) => {
	try {
		const fetchedAuth = await findOneAuthRepo({ match, select })
		return fetchedAuth
	} catch (err) {
		errorHandler({ err })
	}
})

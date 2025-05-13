const express = require('express')
const router = express.Router()
const { body, query, param } = require('express-validator')
const { authenticate } = require(`../../core/auth`)
const { errorHandler, objectIdValidator, validatorCheck } = require('../../core/utils/error')

router.get('/blocking', async (req, res) => {
	//setTimeout(()=>res.send('done'),10000)
	const now = new Date().getTime()
	while (new Date().getTime() < now + 10000) {}
	res.send('done')
})

router.post(
	'/test',

	async (req, res) => {}
)

module.exports = router

const { randomUUID } = require('crypto')

//process transaction id
exports.tidHandler = (req, res, next) => {
	if (!req.headers.tid) {
		req.headers.tid = randomUUID()
	}
	res.append('tid', req.headers.tid)
	next()
}

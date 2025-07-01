import { randomUUID } from 'crypto'
export const tidHandler = (req, res, next) => {
	if (!req.headers.tid) {
		req.headers.tid = randomUUID()
	}
	res.append('tid', req.headers.tid)
	next()
}

const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {
	const header = req.headers.authorization || ''
	const token = header.replace('Bearer ', '')

	try {
		req.user = jwt.verify(token, SECRET)
		next()
	} catch {
		res.status(401).json({ message: 'Unauthorized' })
	}
}
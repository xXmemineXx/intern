const user_service = require('../services/users_services')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.list = async (req, res, next) => {
	try {
		res.json(await user_service.list())
	} catch (err) {
		next(err)
	}
}

exports.create = async (req, res, next) => {
	try {
		const { password } = req.body
		const password_hash = await bcrypt.hash(password, 10)
		delete req.body.password
		req.body.password_hash = password_hash
		const user = await user_service.create(req.body)
		res.status(201).json(user)
	} catch (err) {
		next(err)
	}
}

exports.update = async (req, res, next) => {
	try {
		const {id_, ...data} = req.body
		const usr = await user_service.getId(id_)

		if (usr.account_status == 'pending' && data.account_status == 'blocked') {
			const user = await user_service.delete(id_)
		} else {
			const user = await user_service.modify(id_, data)
		}
	} catch (err) {
		next(err)
	}
}

exports.find = async (req, res, next) => {
	try {
		const user = await user_service.getId(req.body.id_)
		res.status(302).json(user)
	} catch (err) {
		next(err)
	}
}

exports.log = async (req, res, next) => {
	try {
		const { password, id_ } = req.body
		const user = await user_service.getId(id_)
		const SECRET = process.env.JWT_SECRET

		if (!user || !(await bcrypt.compare(password, user.password_hash) )) {
			return res.status(401).json({message : "invalid credentials"})
		}
		if (user.account_status == "pending"){
			return res.status(401).json({message : "account validation is still pending"})
		} else if (user.account_status == "blocked") {
			return res.status(401).json({message : "this account is blocked"})
		}

		const token = jwt.sign({id_ : user.id_}, SECRET, {expiresIn : '2h'})
		res.json({token})

	} catch (err) {
		next(err)
	}
}

exports.me = async (req, res, next) => {
	try {
		const user = await user_service.getId(req.user.id_)
		if (!user) return res.status(401).json({ message: 'Unauthorized' })

		res.json({ id: user.id_, name: user.name_, role: user.role_ })
	} catch (err) {
		next(err)
	}
}
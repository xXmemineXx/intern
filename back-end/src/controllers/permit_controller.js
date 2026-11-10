const permit_service = require('../services/permit_services')

exports.list = async (req, res, next) => {
	try{
		res.json(await permit_service.list(req.body))
	} catch (err) {
		next(err)
	}

}
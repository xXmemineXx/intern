const prisma = require('../prisma')

exports.getId = async (id) => prisma.review.findUnique({where : {id}})

exports.assess = async (id, data) => prisma.review.update({
	where : {id},
	data : {data}
})
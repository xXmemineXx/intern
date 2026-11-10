const prisma = require('../prisma')

exports.list = async (id) => prisma.permit.findMany({
	where : {account_id : {id}}
})

exports.create = async (data) => {
	try {
		prisma.permit.create({data})
	} catch (err) {
		throw (err)
	}
}

exports.getId = async (id) => prisma.permit.delete({where : {id}})
const prisma = require('../prisma');

exports.list = async() => prisma.users.findMany();

exports.getId = async (id) => prisma.users.findUnique({
	where : {id_ : id} 
})

exports.create = async (data) => {
	try {
		return await prisma.users.create({ data })
	} catch (err) {
		throw err
	}
}

exports.modify = async (id, data) => {
	try {
		return await prisma.users.update({
			where : {id_ : id},
			data
		})
	} catch (err) {
		throw err
	}
}

exports.delete = async (id) => {
	try {
		return await prisma.users.delete({
			where : {id_ : id}
		})
	} catch (err) {
		throw (err)
	}
}
const { z } = require('zod')

exports.createUserSchema = z.strictObject({
	id_ : z.string(),
	name_ : z.string().trim(),
	firstname_ : z.string().trim(),
	phone_: z.string(),
	mail_ : z.email(),
	regime_ : z.string(),
	service : z.string(),
	poste : z.string(),
	decisional_power : z.boolean(),
	superior_id : z.string().nullable(),
	password : z.string()
})

exports.accountSearch = z.strictObject({
	id_ : z.string()
})

exports.accountLog = z.strictObject({
	id_ : z.string(),
	password : z.string()
})

exports.accountStatusSchema = z.strictObject({
	id_ : z.string(),
	account_status : z.string()
})


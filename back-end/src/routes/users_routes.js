const router = require('express').Router()
const users = require('../controllers/user_controller')
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')

const {createUserSchema, accountStatusSchema, accountSearch, accountLog} = require('../validators/user_validator')

router.get('/', users.list)

router.get('/me', auth, users.me)

router.post('/login', validate(accountLog), users.log)

router.post('/', validate(createUserSchema), users.create)

router.post('/find/', validate(accountSearch), users.find)

router.post('/validate', validate(accountStatusSchema), users.update)


module.exports = router;
const router = require('express').Router()
const permit = require('../controllers/permit_controller')
const validate = require('../middlewares/validate')

router.get('/:id', permit.list)

module.exports = router
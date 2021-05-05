const { Router } = require('../utils/Router')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')
var router = new Router()


router.post('/login',userController.login)
router.post('/register',userController.register)

module.exports.index = router

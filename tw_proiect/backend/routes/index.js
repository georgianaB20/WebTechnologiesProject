const { Router } = require('../utils/Router')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')
var router = new Router()

router.get('/index',recipeController.getMostPopular)
////// get['/']=recipeController.getMostPopular


router.post('/login',userController.login)
router.post('/register',userController.register)
router.post('/adauga_reteta',recipeController.add)


module.exports.index = router

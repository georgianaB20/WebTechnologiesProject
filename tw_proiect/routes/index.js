const { Router } = require('../utils/Router')
const indexController = require('../controller/index')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')
const loginJs = require('../js/login.js')
var router = new Router()


router.get('/', indexController.getIndexHTML)
router.get('/login', userController.getLoginHTML) // select din BD
router.get('/register',userController.getRegisterHTML) // insert in BD
router.get('/public',indexController.getStatics)
router.get('/retetele_mele',recipeController.getRecipesHTML)
router.get('/adauga_reteta',recipeController.getAddRecipeHTML)
router.get('/favorite', recipeController.getFavoriteHTML)

router.post('/login',userController.login)
//router.get('/')

//router.post('/login',userController.login)
//router.get('/retetele_mele',)

module.exports.index = router

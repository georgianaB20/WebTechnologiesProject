const { Router } = require('../utils/Router')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')

const favoriteController = require('../controller/favourites')

var router = new Router()

router.get('/recipes',recipeController.getMostPopular)
router.get('/recipe',recipeController.getRecipe)

router.get('/favorites', favoriteController.getFavorites)
////// get['/']=recipeController.getMostPopular


router.post('/login',userController.login)
router.post('/register',userController.register)
router.post('/recipes',recipeController.addRecipe)

router.put('/change',userController.change)
module.exports.index = router

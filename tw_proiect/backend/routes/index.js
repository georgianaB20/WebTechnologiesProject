const { Router } = require('../utils/Router')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')

const favoriteController = require('../controller/favourites')

var router = new Router()

router.get('/recipes',recipeController.getMostPopular)
router.get('/recipe',recipeController.getRecipe)
router.post('/recipes',recipeController.addRecipe)

router.get('/favorites', favoriteController.getFavorites)
router.put('/favorites/add', favoriteController.addFavorite)


////// get['/']=recipeController.getMostPopular
router.post('/login',userController.login)
router.post('/register',userController.register)

router.put('/change',userController.change)
module.exports.index = router

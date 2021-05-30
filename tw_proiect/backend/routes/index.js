const { Router } = require('../utils/Router')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')

const favoriteController = require('../controller/favourites')
const user = require('../models/user')
const recipe = require('../models/recipe')

var router = new Router()

router.get('/recipes', recipeController.getMostPopular)
router.get('/recipe', recipeController.getRecipe)
router.get('/favorites', favoriteController.getFavorites)
router.get('/recipes/user', recipeController.getRecipesUser) //miky
router.get('/recipes/filter', recipeController.filter);
router.get('/search', recipeController.search)
    // router.post('/picture',recipeController.picture)

router.post('/recipes', recipeController.addRecipe)
router.post('/login', userController.login)
router.post('/register', userController.register)

router.put('/change', userController.change)
router.put('/recipe', recipeController.updateRecipe)
router.put('/favorites/add', favoriteController.addFavorite)
router.put('/favorites/remove', favoriteController.removeFavorite)
router.put('/grant', userController.grant)
router.put('/restrict', userController.restrict)

router.delete('/recipe', recipeController.deleteRecipe)


module.exports.index = router
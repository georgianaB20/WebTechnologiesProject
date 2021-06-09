const { Router } = require('../utils/Router')
const userController = require('../controller/user')
const recipeController = require('../controller/recipe')

const favoriteController = require('../controller/favorite')
    // const user = require('../models/user')
    // const recipe = require('../models/recipe')
const commentController = require('../controller/comment')

let router = new Router()

router.get('/getFilter',recipeController.getFilter)
router.get('/recipes', recipeController.getMostPopular) //OK
router.get('/recipe', recipeController.getRecipe) //OK
router.get('/comment', commentController.getComments) //OK
router.get('/favorites', favoriteController.getFavorites) //OK
router.get('/recipes/user', recipeController.getRecipesUser) //OK
router.get('/recipes/filter', recipeController.filter); //OK
router.get('/search', recipeController.search)
router.get('/get_user', userController.getUser)
router.get('/check_favorite', userController.check_favorite)

router.post('/recipes', recipeController.addRecipe) //OK
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/comment', commentController.addComment)
router.post('/insertFilter',recipeController.insertFilter)

router.put('/change', userController.change)
router.put('/recipe', recipeController.updateRecipe)
router.put('/favorites/add', favoriteController.addFavorite) //OK
router.put('/favorites/remove', favoriteController.removeFavorite) //OK
router.put('/grant', userController.grant)
router.put('/restrict', userController.restrict)

router.delete('/recipe', recipeController.deleteRecipe)
router.delete('/comment', commentController.deleteComment)


module.exports.index = router
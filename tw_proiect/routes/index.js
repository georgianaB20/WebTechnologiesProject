const { Router } = require('../utils/Router')
const indexController = require('../controller/index')
const userController = require('../controller/user')

var router = new Router()


router.get('/', indexController.getIndexHTML)
router.get('/login', userController.login)

///exemplu
///router.get(url_string, functieApelata)
///
module.exports.index = router

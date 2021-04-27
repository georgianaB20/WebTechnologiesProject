const { Router } = require('../utils/Router')
const indexController = require('../controller/index')
const userController = require('../controller/user')

var router = new Router()


router.get('/', indexController.getIndexHTML)
router.get('/login', userController.getLoginHTML) // select din BD
//router.get('/register',userController.register) // insert in BD
router.get('/public',indexController.getStatics) 
//router.post('/login',userController.login)
//router.get('/retetele_mele',)

///exemplu
///router.get(url_string, functieApelata)
///
module.exports.index = router

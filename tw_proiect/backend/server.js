require('dotenv').config()

const { Router } = require('./utils/Router')
const { WebApp } = require('./utils/WebApp')
const constants = require('./utils/constants')

const { index } = require('./routes/index')

const router = new Router()
router.use('', index)

const app = new WebApp(constants.port, router)
app.listen()


// root=tw_proiect
//
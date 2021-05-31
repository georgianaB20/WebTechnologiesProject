const https = require('http2')
const fs = require('fs')
const constants = require('../utils/constants')
class WebApp {
  constructor (port, router) {
    this.port = port
    this.router = router
    this.options = {
      key: fs.readFileSync(constants.keypath),
      cert: fs.readFileSync(constants.certpath)
    };
  }

  use () {

  }

  listen () {
    var app = this
    var server = https.createSecureServer(this.options, function (req, res) {
      app.router.route(req, res)
    })
    server.listen(constants.port)
    console.log(`app running on PORT: ${constants.port}`)
  }
}

module.exports = { WebApp }

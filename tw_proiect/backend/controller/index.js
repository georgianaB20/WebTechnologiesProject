const mongoose = require('mongoose')

const fs = require('fs')


function exampleAPI(req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ success: true, message: 'example ran successfully' }))
}

module.exports = { exampleAPI }
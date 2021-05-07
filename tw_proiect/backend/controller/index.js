const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://TW:tw2021@cluster0.hgmw9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
console.log(mongoose.connection.readyState);

const fs = require('fs')


function exampleAPI(req,res)
{
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success: true, message: 'example ran successfully' }))
}

module.exports = { exampleAPI }


const fs = require('fs');
const qs = require('querystring');
const indexController = require('./index');

function getLoginHTML(req, res) {
  indexController.getHTML(req,res,'login.html')
 
}

function getRegisterHTML(req,res){
  indexController.getHTML(req,res,'register.html')
}

function login(req,res){
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    console.log(req)
    //console.log(req['Form Data'])
    console.log(data);
    res.end();
  })
}

module.exports = { getLoginHTML, getRegisterHTML,login }
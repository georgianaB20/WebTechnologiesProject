const fs = require('fs')

let indexHTML = ''///codul html in string
let indexCSS = '' ///codul css in string
let indexJS = ''  ///codul js in string

function exempleAPI(req,res)
{
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success: true, message: 'example ran successfully' }))
}
function getIndexHTML (req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    data=fs.readFile('../tw_proiect/views/index.html',null,function(error,data){
      if(error){
        console.log(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')
        res.write('Internal server error')
        
      }
      else{
        //console.log(data)
        res.write(data)
      }
      res.end()
    })
    
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
  }
}
   

function getIndexCSS (req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/css')
    res.write(indexCSS)
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/css')
    res.write('Internal server error')
  }
}
function getNavbarCSS (req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/css')
    data=fs.readFile('/tw_proiect/css/nav.css',null,function(error,data){
      if(error){
        console.log(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/css')
        res.write('Internal server error')
        
      }
      else{
        //console.log(data)
        res.write(data)
      }
      res.end()
    })
    
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
  }
}
function getIndexJS (req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/javascript')
    res.write(indexJS)
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
  }
}

module.exports = { getIndexHTML, getIndexCSS, getIndexJS, exempleAPI}


const fs = require('fs');

function getLoginHTML(req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    data=fs.readFile('../tw_proiect/views/login.html',null,function(error,data){
      if(error){
        console.log(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')
        res.write('Internal server error')
        
      }
      else{
        res.write(data)
      }
      res.end()
    })
    
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
    res.end()
  }
  // res.write("<h1>Am ajuns</h1>");
  // res.end();
}

module.exports = { getLoginHTML }
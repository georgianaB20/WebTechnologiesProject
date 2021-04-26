const fs = require('fs');

function login(req, res) {
  try{
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.readFile('/views/login.html',null, function(error,data){
      console.log(data)
      if(error){
        res.writeHead(404);
        res.write('Page not found');
      }else
      {
        res.write(data)
      }

      res.end();
    });
  }catch(e){
    res.writeHead(500);
    res.write('Internal server error');
    res.end()
  }
  // res.write("<h1>Am ajuns</h1>");
  // res.end();
}

module.exports = { login }
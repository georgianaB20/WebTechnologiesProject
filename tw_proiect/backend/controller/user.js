function login(req,res,headers){
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    //console.log(req)
    //console.log(req['Form Data'])
    console.log("from userController:"+data);
    res.writeHead(200, headers)
    res.write(data)
    res.end()
  })
}

function register(req,res,headers){
  let data='';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    data=JSON.parse(data);
    ////console.log(JSON.parse(data).username);

    //verificari parola
    if (data.password !== data.confirm_password){
      res.writeHead(422,headers)
      //res.write(JSON('{message:"Bad password"}'))
      res.end();
    }
    else{
      //console.log("from userController:"+data);
      res.writeHead(200, headers)
      res.write(data)
      res.end()
    }
  })
}

module.exports = { login, register }
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

module.exports = { login }
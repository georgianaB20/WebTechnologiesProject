function login(req,res,headers){
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    res.writeHead(200, headers)
    res.write(data)
    res.end()
  })
}

module.exports = { login }
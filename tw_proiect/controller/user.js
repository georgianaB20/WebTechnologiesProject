

function login(req,res){
    try {
        console.log(req.url)
        
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.write('<h1>te-ai logat!<h1>') //de pus codul pentru 
      } catch (e) {
        console.log(e)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')
        res.write('Internal server error')
      }
}

module.exports = { login }
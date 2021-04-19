const http = require('http')

const server = http.createServer((request,response) => {

    const url=request.url;
    switch(url)
    {
        case "/":
            response.statusCode = 200
            response.setHeader('Content-Type','text/html')
            response.write('<h1> Hello there <h1>')
            response.end()

    }

    response.statusCode = 200
    response.setHeader('Content-Type','text/html')
    response.write('<h1> Hello there <h1>')
    response.end()
})

const PORT = process.env.PORT || 5000

server.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
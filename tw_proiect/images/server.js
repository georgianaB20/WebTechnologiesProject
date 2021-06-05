var path = require('path');
var http = require('http');
var fs = require('fs');
const { runInNewContext } = require('vm');

var dir = path.join(__dirname, 'public');

var mime = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml'
};

var server = http.createServer(function (req, res) {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        if (req.method === 'GET')
            data = { 'name': decodeURIComponent(req.url.split('?')[1]) }
        else data = JSON.parse(data);

        var reqpath = data.name;
        if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE' && req.method !== 'PUT') {
            res.statusCode = 501;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Method not implemented');
        }
        var file = path.join(dir, reqpath);

        if (file.indexOf(dir + path.sep) !== 0) { //Daca incerc sa caut in afara folderului public, dau 403, pt ca nu am acces.
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Forbidden');
        }

        console.log(file)
        console.log(typeof file)

        if (req.method === 'GET') {
            var type = mime[path.extname(file).slice(1)] || 'text/plain';
            var s = fs.createReadStream(file);
            s.on('open', function () {
                res.setHeader('Content-Type', type);
                s.pipe(res);
            });
            s.on('error', function () {
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 404;
                res.end('Not found');
            });
        }

        if (req.method === 'DELETE') {
            var s = fs.unlink(path, function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.end("Internal error!");
                }
                res.statusCode = 200;
                res.end('Deleted image successfully');
            })
        }

        if (req.method === 'PUT' || req.method === 'POST') {
            fs.writeFile(file, Buffer.from(data.base64, 'base64'), function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.end("Internal error!");
                }
                res.statusCode = 200;
                res.end('Deleted image successfully');
            })
        }
    });
});

server.listen(7001, function () {
    console.log('Listening on http://localhost:7001/');
});
var path = require('path');
var http = require('http');
var fs = require('fs');
const { runInNewContext } = require('vm');

var dir = path.join(__dirname, 'public');

var mime = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    json: 'application/x-download',
    html: 'application/x-download',
    csv: 'text/csv'
};

var server = http.createServer(function(req, res) {
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

        if (req.method === 'GET') {
            var type = mime[path.extname(file).slice(1)] || 'text/plain';
            var s = fs.createReadStream(file);
            s.on('open', function() {
                res.setHeader('Content-Type', type);
                s.pipe(res);
            });
            s.on('error', function() {
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 404;
                res.end('Not found');
            });
        }

        if (req.method === 'DELETE') {
            var s = fs.unlink(path, function(err) {
                if (err) {
                    res.statusCode = 500;
                    res.end("Internal error!");
                }
                res.statusCode = 200;
                res.end('Deleted image successfully');
            })
        }

        if (req.method === 'PUT' || req.method === 'POST') {
            // console.log(file === "C:\\xampp\\htdocs\\whaf\\tw_proiect\\images\\public\\files\\")
            if (reqpath === "/files/ingrediente") {
                let includes_json = file + "_include.json"
                let excludes_json = file + "_exclude.json"
                let includes_csv = file + "_include.csv"
                let excludes_csv = file + "_exclude.csv"
                let includes_html = file + "_include.html"
                let excludes_html = file + "_exclude.html"
                let retete_json = "C:\\xampp\\htdocs\\whaf\\tw_proiect\\images\\public\\files\\" + "retete_populare.json"
                let retete_csv = "C:\\xampp\\htdocs\\whaf\\tw_proiect\\images\\public\\files\\" + "retete_populare.csv"
                let retete_html = "C:\\xampp\\htdocs\\whaf\\tw_proiect\\images\\public\\files\\" + "retete_populare.html"
                let success = 0
                    //-------------------JSON
                try {
                    fs.writeFileSync(includes_json, JSON.stringify(data.includes, null, 4), 'utf8')
                    console.log(includes_json + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }

                //fs.writeFile(excludes_json, JSON.stringify(data.excludes, null, 4), 'utf8')
                try {
                    fs.writeFileSync(excludes_json, JSON.stringify(data.excludes, null, 4), 'utf8')
                    console.log(excludes_json + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }

                //fs.writeFile(retete_json, JSON.stringify(data.retete, null, 4), 'utf8')
                try {
                    fs.writeFileSync(retete_json, JSON.stringify(data.retete, null, 4), 'utf8')
                    console.log(retete_json + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }

                //-------------------CSV
                var json = data.includes
                var fields = ["name", "includes", "excludes"]
                var replacer = function(key, value) { return value === null ? '' : value }
                var csv = json.map(function(row) {
                    return fields.map(function(fieldName) {
                        return JSON.stringify(row[fieldName], replacer)
                    }).join(',')
                })
                csv.unshift(fields.join(',')) // add header column
                csv = csv.join('\r\n');
                // fs.writeFile(includes_csv, csv, 'utf8')
                try {
                    fs.writeFileSync(includes_csv, csv, 'utf8')
                    console.log(includes_csv + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }


                var json = data.excludes
                var fields = ["name", "excludes", "includes"]
                var replacer = function(key, value) { return value === null ? '' : value }
                var csv = json.map(function(row) {
                    return fields.map(function(fieldName) {
                        return JSON.stringify(row[fieldName], replacer)
                    }).join(',')
                })
                csv.unshift(fields.join(',')) // add header column
                csv = csv.join('\r\n');
                // console.log(csv)
                // fs.writeFile(excludes_csv, csv, 'utf8')
                try {
                    fs.writeFileSync(excludes_csv, csv, 'utf8')
                    console.log(excludes_csv + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }


                var json = data.retete
                var fields = ["titlu", "popularitate", "ingrediente", "descriere"]
                var replacer = function(key, value) { return value === null ? '' : value }
                var csv = json.map(function(row) {
                    return fields.map(function(fieldName) {
                        return JSON.stringify(row[fieldName], replacer)
                    }).join(',')
                })
                csv.unshift(fields.join(',')) // add header column
                csv = csv.join('\r\n');
                // console.log(csv)
                // fs.writeFile(retete_csv, csv, 'utf8')
                try {
                    fs.writeFileSync(retete_csv, csv, 'utf8')
                    console.log(retete_csv + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }


                //----------------HTML
                let style = `<style>
                body {
                    background-color: rgba(207, 180, 145, 0.9);
                    color: green;
                }
                
                table {
                    font-family: arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                  }
                  
                  td, th {
                    border: 1px solid green;
                    text-align: center;
                    padding: 8px;
                  }
                  tr:nth-child(even) {
                    background-color: rgba(0,128,0,0.2);
                  }
                  h1{
                      text-align:center;
                  }
                </style>`

                let header = `<!DOCTYPE html>
                <html lang="ro">
                <head>
                    ${style}
                    <meta charset="UTF-8">
                    <title>Ingredientele cele mai populare</title>                
                </head><body>\n<h1>Ingredientele cele mai populare</h1>\n
                <table>
                <tr>   
                    <th>Ingredient</th>
                    <th>Incluziuni</th>
                    <th>Excluziuni</th>
                </tr>`
                let html_file_includes = header
                data.includes.forEach(element => {
                    html_file_includes += `<tr>\t<td>${element.name.toUpperCase()}</td>\n`
                    html_file_includes += `\t<td>${element.includes}</td>\n`
                    html_file_includes += `\t<td> ${element.excludes}</td>\n<tr>\n`
                });
                html_file_includes += "</table>\n</body>\n</html>"

                let html_file_excludes = `<!DOCTYPE html>
                <html lang="ro">
                <head>
                    ${style}
                    <meta charset="UTF-8">
                    <title>Ingredientele cele mai evitate</title>                
                </head>
                <body>\n<h1>Ingredientele cele mai evitate</h1>\n
                <table>
                <tr>   
                    <th>Ingredient</th>
                    <th>Excluziuni</th>
                    <th>Incluziuni</th>
                </tr>`
                data.excludes.forEach(element => {
                    html_file_excludes += `<tr>\t<td>${element.name.toUpperCase()}</td>\n`
                    html_file_excludes += `\t<td>${element.excludes}</td>\n`
                    html_file_excludes += `\t<td>${element.includes}</td>\n</tr>\n`
                });
                html_file_excludes += "</table>\n</body>\n</html>"

                // console.log(html_file_excludes)
                // console.log(html_file_includes)

                // fs.writeFile(includes_html, html_file_includes, 'utf8')
                try {
                    fs.writeFileSync(includes_html, html_file_includes, 'utf8')
                    console.log(includes_html + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }

                // fs.writeFile(excludes_html, html_file_excludes, 'utf8')
                try {
                    fs.writeFileSync(excludes_html, html_file_excludes, 'utf8')
                    console.log(excludes_html + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }
                /// --------------- RETETE POPULARE HTML
                // console.log(data.retete.length)
                style = `<style>
                body {
                    background-color: rgba(207, 180, 145, 0.9);
                    color: green;
                    font-family: arial, sans-serif;
                }
                
                h4 {
                    padding-left: 3em;
                }
                
                ul {
                    padding-left: 3em;
                }
                
                h1 {
                    text-align: center;
                }
                
                p {
                    padding-left: 3em;
                }
                </style>
                `
                let html_recipe = `
                <!DOCTYPE html>
                <html lang="ro">
                <head>
                    ${style}
                    <meta charset="UTF-8">
                    <title>Retetele cele mai populare</title>                
                </head>
                <body>\n<h1>Retetele cele mai populare</h1>\n`

                for (let i = 0; i < data.retete.length; i++) {
                    // console.log(data.retete[i].ingrediente.length)
                    html_recipe += `<h2>${(i+1)}.${data.retete[i].titlu.toUpperCase()}</h2>\n`
                    html_recipe += `<h4>Popularitate: ${data.retete[i].popularitate}</h4>\n`
                    html_recipe += `<h4>Ingrediente</h4>\n<ul>`
                    for (let j = 0; j < data.retete[i].ingrediente.length; j++)
                        html_recipe += `<li>${data.retete[i].ingrediente[j]}</li>\n`
                    html_recipe += `</ul>\n<h4>Pasi de preparare</h4>\n`
                    html_recipe += `<p>${data.retete[i].descriere}</p>\n`
                }

                html_recipe += `</body>\n</html>`

                // fs.writeFile(retete_html, html_recipe, 'utf8')
                try {
                    fs.writeFileSync(retete_html, html_recipe, 'utf8')
                    console.log(retete_html + " was saved!");
                    success += 1
                } catch (err) {
                    console.log(err)
                }

                if (success === 9) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ "message": "Files updated successfully." }));
                } else {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ "message": "Failed to update the files." }));
                }



            } else {
                fs.writeFile(file, Buffer.from(data.base64, 'base64'), function(err) {
                    if (err) {
                        res.statusCode = 500;
                        res.end("Internal error!");
                    }
                    res.statusCode = 200;
                    res.end('Saved image successfully');
                })
            }
        }
    });
});

server.listen(7001, function() {
    console.log('Listening on http://localhost:7001/');
});
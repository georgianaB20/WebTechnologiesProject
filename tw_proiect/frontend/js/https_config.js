var fs = require("fs");
var path = require('path')

module.exports = {
    cert: fs.readFileSync(path.join(__dirname, "security", "cert.pem")),
    key: fs.readFileSync(path.join(__dirname, "security", "cert.key")),
    passphrase: "tw2021"
};
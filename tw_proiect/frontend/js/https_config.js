var fs = require("fs");
 
module.exports = {
    cert: fs.readFileSync(__dirname + "/security/cert.pem"),
    key: fs.readFileSync(__dirname + "/security/cert.key"),
    passphrase: "tw2021"
};
const port = 5000;
const db = process.env.DB_URL
const keypath =  "security/cert.key"
const certpath =  "security/cert.pem"

module.exports = {port, db, keypath, certpath}

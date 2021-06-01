const port = 7000;
const db = process.env.DB_URL
const key = process.env.PRIVATE_KEY
const keypath = "security/cert.key"
const certpath = "security/cert.pem"

module.exports = { port, db, keypath, certpath }
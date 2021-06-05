const port = 5000;
const db = process.env.DB_URL
const key = process.env.PRIVATE_KEY
const keypath = "security/cert.key"
const certpath = "security/cert.pem"
const images_server_url = "http://localhost:7001"

module.exports = { port, db, keypath, certpath, images_server_url, key }
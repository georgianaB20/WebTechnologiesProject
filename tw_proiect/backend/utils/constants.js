const port = 5000;
const db = process.env.DB_URL
const key = process.env.PRIVATE_KEY

module.exports = { port, db, key }
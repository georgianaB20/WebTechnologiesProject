const mongoose = require('mongoose');
const User = require('../models/user')
const { db } = require('../utils/constants')

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });


async function getFavorites(req, res, headers){
    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);

    const user_id = parsedUrl.searchParams.get('uid');

    // console.log(user_id);

    try {
        let user_by_id = await User.findById(user_id);
        if (user_by_id !== null && 'favorite' in user_by_id) {
            await user_by_id.populate('favorite').execPopulate();
            console.log(user_by_id.favorite);

            res.writeHead(200, headers);
            res.write(JSON.stringify(user_by_id.favorite, null, 4));
            res.end();
        }
        else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'Userul nu a fost gasit!' }, null, 4))
            res.end()
        }
    } catch (e) {
        console.log(e);
        res.writeHead(500, headers);
        res.write(JSON.stringify({ 'message': 'Eroare la server!' }, null, 4))
        res.end()
    }
}

module.exports = {getFavorites}
const mongoose = require('mongoose');
const User = require('../models/user')
const Recipe = require('../models/recipe')
const { db } = require('../utils/constants')

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

async function getFavorites(req, res, headers){
    // http://localhost:5000/favorites?user_id=6099a85c85afd46d920f4fbd
    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);

    const user_id = parsedUrl.searchParams.get('user_id');

    console.log(user_id);

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

async function addFavorite(req, res, headers){
    //http://localhost:5000/favorites/add?user_id=6099a85c85afd46d920f4fbd&recipe_id=609a73bf5c4932a37ad78a7e
    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);

    const user_id = parsedUrl.searchParams.get('user_id');
    const recipe_id = parsedUrl.searchParams.get('recipe_id');

     console.log("user id: " + user_id);
     console.log("recipe id: " + recipe_id);

    let user_by_id = await User.findById(user_id);
    let recipe_by_id = await Recipe.findById(recipe_id);
    let duplicate = 0;

    try {
        if (user_by_id === null) {
            res.writeHead(404, headers);
            res.write(JSON.stringify({'message': 'Userul nu a fost gasit!'}, null, 4))
            res.end()
            return;
        }
        if (recipe_by_id !== null) {
            for (let i = 0; i < user_by_id.favorite.length; i++) {
                if (recipe_id === user_by_id.favorite[i].toString()) {
                    duplicate = 1;
                }
            }
            if (duplicate){
                res.writeHead(400, headers);
                res.write(JSON.stringify({'message': 'Reteta este deja in favorite'}, null, 4));
                res.end();
            }else{
                console.log(user_by_id.favorite)
                user_by_id.favorite.push(recipe_by_id._id);
                await user_by_id.save(function (err) {
                    if (err) {
                        //console.log(err);
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({'message': 'Eroare interna!'}, null, 4))
                        res.end()
                    } else {
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({"message": "Reteta adaugata cu succes la favorite!"}, null, 4))
                        res.end();
                    }
                });
            }
        } else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({'message': 'Reteta nu a fost gasita!'}, null, 4))
            res.end()
        }
    } catch (err) {
        //console.log(err)
        res.writeHead(500, headers);
        res.write(JSON.stringify({'message': 'Eroare interna!'}, null, 4))
        res.end()
    }
}

async function removeFavorite(req, res, headers) {
    // http://localhost:5000/favorites/remove?user_id=6099a85c85afd46d920f4fbd&recipe_id=609a73bf5c4932a37ad78a7e
    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);


    const user_id = parsedUrl.searchParams.get('user_id');
    const recipe_id_str = parsedUrl.searchParams.get('recipe_id');
    const recipe_id = mongoose.Types.ObjectId(recipe_id_str);

    let user_by_id = undefined;

    try {
        user_by_id = await User.findById(user_id);


        if (user_by_id === null) {
            res.writeHead(404, headers);
            res.write(JSON.stringify({'message': 'Userul nu a fost gasit!'}, null, 4))
            res.end()
            return;
        }

        const idx = user_by_id.favorite.some(el => el.equals(recipe_id))

        if (idx) {
            user_by_id.favorite.pull(recipe_id);
            await user_by_id.save();
            res.writeHead(200, headers);
            res.write(JSON.stringify({"message": "Reteta a fost stearsa cu succes de la favorite!"}, null, 4))
            res.end();
        } else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({'message': 'Reteta nu exista in favorite!'}, null, 4))
            res.end()
        }
    } catch (e) {
        //console.log(e)
        res.writeHead(500, headers);
        res.write(JSON.stringify({'message': 'Eroare interna!'}, null, 4))
        res.end()
    }
}

module.exports = {getFavorites, addFavorite, removeFavorite}

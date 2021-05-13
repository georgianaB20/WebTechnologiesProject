const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
const { db } = require('../utils/constants')
let url = require('url')

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
//console.log(mongoose.connection.readyState);

async function getMostPopular(req, res, headers) {
    try {
        let recipe2 = await Recipe.find({}, 'title pasi_preparare ingredients');
        if (recipe2 !== null) {
            //datele primite de la bd le trimitem prin response
            res.writeHead(200, headers);
            res.write(JSON.stringify(recipe2, null, 4))
            res.end()
        }
        else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'recipes not found' }, null, 4))
            res.end()
        }
    }
    catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'recipes not found' }, null, 4))
        res.end()
    }

}

async function getRecipe(req, res, headers) {
    //console.log(req.url);
    let id = url.parse(req.url).query.split('&')[0] //luam id-ul pt a l folosi in query
    id = id.split('=')[1]
    //console.log(id)
    try {
        let recipebyid = await Recipe.findById(id);
        console.log(recipebyid)
        if (recipebyid !== null) {
            res.writeHead(200, headers);
            res.write(JSON.stringify(recipebyid, null, 4))
            res.end()
        }
        else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'Reteta nu a fost gasita!' }, null, 4))
            res.end()
        }
    }
    catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Reteta nu a fost gasita!' }, null, 4))
        res.end()
    }
}

function addRecipe(req, res, headers) {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        data = JSON.parse(data);

        let no_ingredients = Object.keys(data).length - 6;
        let ingredient = [];

        console.log(data);

        for (let i = 1; i <= no_ingredients; i++) {
            if (data["ingredient" + i] !== "") {
                ingredient[i - 1] = data["ingredient" + i];
            }

            delete data["ingredient" + i];
        }

        if (ingredient.length === 0) {
            res.writeHead(400, headers);
            res.write(JSON.stringify({"message":"Nu puteti adauga o reteta fara ingrediente"}, null, 4));
            res.end();
            return;
        }

        data.ingrediente = ingredient;

            const new_recipe = new Recipe(data);
            console.log(new_recipe);
            new_recipe.save(function (err) {
            if (err) {
                console.log(err);
                res.writeHead(500, headers);
                res.write(JSON.stringify({'message': 'Eroare interna!'}, null, 4))
                res.end()
            }
            else {
                res.writeHead(200, headers);
                res.write(JSON.stringify({"message": "Reteta adaugata cu succes!"}, null, 4))
                res.end()
            }
            });
    })

}
module.exports = { getMostPopular, getRecipe, addRecipe }
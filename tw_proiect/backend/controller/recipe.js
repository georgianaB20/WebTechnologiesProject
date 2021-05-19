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


/*
json sample for testing addRecipe
{
  "username":"georgiana",
  "title":"Salata cu ton",
  "picture":"",
  "time_value": 20,
  "time_unit":"minute",
  "difficulty":"incepator",
  "description": "Se taie rosiile,salata si se pun intr-un bol. Se pune tonul maruntit in bol, alaturi de salata si rosii. Se adauga ulei si sare dupa gust.",
  "ingredient1":"salata",
  "ingredient2":"rosii",
  "ingredient3":"o conserva de ton",
  "ingredient4":"ulei dupa gust",
  "ingredient5":"sare dupa gust"
}

*/

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
            res.write(JSON.stringify({ "message": "Nu puteti adauga o reteta fara ingrediente" }, null, 4));
            res.end();
            return;
        }

        data.ingredients = ingredient;

        const new_recipe = new Recipe(data);
        console.log(new_recipe);
        new_recipe.save(function (err) {
            if (err) {
                console.log(err);
                res.writeHead(500, headers);
                res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                res.end()
            }
            else {
                res.writeHead(200, headers);
                res.write(JSON.stringify({ "message": "Reteta adaugata cu succes!" }, null, 4))
                res.end()
            }
        });
    })

}

async function getRecipesUser(req, res, headers) {//returns a json with all reciepes from a user, by username
    try {
        if (req.url.split("?")[1].split('=')[0] == 'username') {
            let user = req.url.split("?")[1].split('=')[1]
            //let recipebyid = await Recipe.findById(id);
            console.log(user)
            let recipes = await Recipe.find({ username: user })
            var len = recipes.length
            if (len == 0) {
                res.writeHead(404, headers)
                res.write(JSON.stringify({ "message": "Rezultatul nu a fost gasit!" }, null, 4));
                res.end();
                return;
            }
            else{
                res.writeHead(200, headers)
                res.write(JSON.stringify(recipes, null, 4));
                res.end();
                return;
            }
            console.log(len)
        }
        else {
            res.writeHead(400, headers);//bad request, nu se pot afisa retetele unui user decat cautate dupa username
            res.write(JSON.stringify({ "message": "Nu puteti cauta retetele unui user decat dupa username-ul acestuia!" }, null, 4));
            res.end();
            return;
        }
    }

    catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
        res.end()
    }
}


function updateRecipe(req, res, headers) {
    console.log(req.url.split("?")[1].split("=")[1])
}
module.exports = { getMostPopular, getRecipe, addRecipe, updateRecipe, getRecipesUser }
const mongoose = require('mongoose');
const recipe = require('../models/recipe');
const Recipe = require('../models/recipe')
const { db } = require('../utils/constants')
var url = require('url')

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
            res.write(JSON.stringify({ 'message': 'recipe not found' }, null, 4))
            res.end()
        }
    }
    catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'recipe not found' }, null, 4))
        res.end()
    }
}

// function add(req, res, headers) {
//     console.log("am ajuns!")
// }

module.exports = { getMostPopular, getRecipe }
const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
const { db } = require('../utils/constants')

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
console.log(mongoose.connection.readyState);

async function getMostPopular(req, res, headers) {
    console.log(mongoose.connection.readyState)
    console.log("recipeController:retetele cele mai populare");


    /*
    Recipe.findOne({'title': 'Salata'},
        'title pasi_preparare ingredients',
        null,
        function (err, recipe2) {
            if (err) {
                console.log(`error: {err}`);
                return;
            }
            console.log(JSON.stringify(recipe2));
            // console.log(recipe2.title, recipe2.pasi_preparare, recipe2.ingredients);
        });
     */

    let recipe2 = await Recipe.find({}, 'title pasi_preparare ingredients');
    console.log(JSON.stringify(recipe2, null, 4));

    //datele primite de la bd le punem in loc de stringul de mai jos

    var data = '{"message":"Saliut saliut"}'
    res.writeHead(200, headers);
    res.write(JSON.stringify(recipe2, null, 4))
    res.end()

}

// function add(req, res, headers) {
//     console.log("am ajuns!")
// }

module.exports = {getMostPopular}
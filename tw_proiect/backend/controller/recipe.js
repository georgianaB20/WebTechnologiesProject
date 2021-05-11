const mongoose = require('mongoose');
const Recipe = require('../models/recipe')

//mongoose.connect('mongodb+srv://TW:tw2021@cluster0.hgmw9.mongodb.net/whaf', {useNewUrlParser: true, useUnifiedTopology: true});
console.log(mongoose.connection.readyState);

async function getMostPopular(req,res,headers){
    console.log(mongoose.connection.readyState)
    console.log("recipeController:retetele cele mai populare");
    //interogam BD luam niste date 
    // const query = Recipe.find({})

    // query.exec(function (err, recipes) {
    //     if (err) return handleError(err);
    //     // Prints "Space Ghost is a talk show host."
    //     console.log(recipes);
    //   });

    // const stuff = Recipe.find({},function(err,recipes){
    //     if(err)
    //         console.log("eroare cv")
    //     console.log(JSON.stringify(recipes))
    // });
    //console.log(stuff)

    // for (let doc = cursor.next(); doc != null; doc = cursor.next()) {
    // console.log(doc); // Prints documents one at a time
    // }


    Recipe.findOne({'title' : 'Salata'},
      'title pasi_preparare ingredients',
       function(err,recipe2){
           if (err) return;
         console.log(recipe2.title,recipe2.pasi_preparare,recipe2.ingredients)
        }
    )

    //datele primite de la bd le punem in loc de stringul de mai jos


    var data='{"message":"Saliut saliut"}'
    res.writeHead(200,headers);
    res.write(data)
    res.end()

}

function add(req,res,headers){
    console.log("am ajuns!")
}

module.exports={getMostPopular,add }
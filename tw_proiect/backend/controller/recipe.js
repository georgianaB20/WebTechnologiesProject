const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
const User = require('../models/user')
const { db } = require('../utils/constants')
let url = require('url');
const user = require('../models/user');
const recipe = require('../models/recipe');

const { Schema, model } = require('mongoose');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { index } = require('../routes');


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
//console.log(mongoose.connection.readyState);

function compare(a, b) {
    if (a.comments.length > b.comments.length) return -1;
    if (b.comments.length > a.comments.length) return 1;
    return 0;
}

async function getMostPopular(req, res, headers) {
    try {

        //let recipe2 = await Recipe.find({}, 'title pasi_preparare ingredients');
        let recipe2 = await Recipe.find({});

        if (recipe2 !== null) {
            recipe2.sort(compare);
            // console.log(recipe2[0].length)
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
        // console.log(recipebyid)
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

        //console.log(data);

        for (let i = 1; i <= no_ingredients; i++) {
            if (data["ingredient" + i] !== "" && data["ingredient" + i] !== undefined && data["ingredient" + i] !== null) {
                ingredient[i - 1] = data["ingredient" + i];
            }
            // console.log(data["ingredient" + i])

            delete data["ingredient" + i];
        }

        if (ingredient.length === 0) {
            res.writeHead(400, headers);
            res.write(JSON.stringify({ "message": "Nu puteti adauga o reteta fara ingrediente" }, null, 4));
            res.end();
            return;
        }

        data.ingredients = ingredient;
        console.log(data.ingredients)

        const new_recipe = new Recipe(data);
        // console.log(new_recipe);
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
            let userexists = await User.findOne({ username: user })
            //let recipebyid = await Recipe.findById(id);
            console.log(user)
            let recipes = await Recipe.find({ username: user })
            var len = recipes.length
            console.log(userexists)
            if (userexists === null) {
                res.writeHead(404, headers)
                res.write(JSON.stringify({ "message": "Userul nu exista!" }, null, 4));
                res.end();
                return;
            }
            else
                if (len === 0) {
                    res.writeHead(404, headers)
                    res.write(JSON.stringify({ "message": "Userul nu are retete" }, null, 4));
                    res.end();
                    return;
                }
                else {
                    res.writeHead(200, headers)
                    res.write(JSON.stringify(recipes, null, 4));
                    res.end();
                    return;
                }
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
    let userid = req.url.split('?')[1].split('&')[0].split('=')[1]
    let recipeid = req.url.split('?')[1].split('&')[1].split('=')[1]
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async () => {
        try {
            data = JSON.parse(data);
            //aici lucram cu datele primite, le prelucram etc
            console.log(data)
            if (userid === undefined || recipeid === undefined) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'URL invalid.' }, null, 4))
                res.end()
                return;
            }
            else {
                let user = await User.findById(userid)//daca nu gaseste=null
                let recipe = await Recipe.findById(recipeid)
                if (user === null) {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({ 'message': 'Userul nu exista' }, null, 4))
                    res.end()
                    return;
                }
                if (recipe === null) {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({ 'message': 'Reteta nu exista' }, null, 4))
                    res.end()
                    return;
                }
                if (user.username !== recipe.username) {
                    res.writeHead(422, headers);
                    res.write(JSON.stringify({ 'message': 'Nu puteti edita aceasta reteta.' }, null, 4))
                    res.end()
                    return;
                }
                if (data.description !== null) {
                    recipe.description = data.description
                }
                if (data.difficulty !== null) {
                    recipe.difficulty = data.difficulty
                }
                if (data.picture !== null) {
                    recipe.picture = data.picture
                }
                if (data.picture !== null) {
                    recipe.time_unit = data.time_unit
                }
                if (data.time_value !== null) {
                    recipe.time_value = data.time_value
                }
                if (data.title !== null) {
                    recipe.title = data.title
                }
                let no_ingredients = Object.keys(data).length - 6;
                let ingredient = [];
                for (let i = 1; i <= no_ingredients; i++) {
                    if (data["ingredient" + i] !== "") {
                        ingredient[i - 1] = data["ingredient" + i];
                    }

                    delete data["ingredient" + i];
                }
                if (ingredient.length !== 0) {
                    recipe.ingredients = ingredient
                }
                console.log(recipe)

                let ok = await recipe.save()
                //console.log(ok, user)
                if (ok === recipe) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Reteta actualizata!' }, null, 4))
                    res.end()
                }
                else {
                    //console.log()
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }
            }

        }
        catch (err) {
            console.log(err)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}

async function deleteRecipe(req, res, headers) {
    try {
        let userid = req.url.split('?')[1].split('&')[0].split('=')[1]
        let recipeid = req.url.split('?')[1].split('&')[1].split('=')[1]

        //data = JSON.parse(data);
        //aici lucram cu datele primite, le prelucram etc
        if (userid === undefined || recipeid === undefined) {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'URL invalid.' }, null, 4))
            res.end()
            return;
        }
        else {
            let user = await User.findById(userid)//daca nu gaseste=null
            let recipe = await Recipe.findById(recipeid)
            if (user === null) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Userul nu exista' }, null, 4))
                res.end()
                return;
            }
            if (recipe === null) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Reteta nu exista' }, null, 4))
                res.end()
                return;
            }
            if (!(user.username === recipe.username || (user.type === 'admin'))) {
                res.writeHead(422, headers);
                res.write(JSON.stringify({ 'message': 'Nu puteti sterge aceasta reteta.' }, null, 4))
                res.end()
                return;
            }
            else {
                Recipe.findByIdAndDelete(recipeid, function (err, docs) {
                    if (err) {
                        console.log(err)
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare de la baza de date' }, null, 4))
                        res.end()
                        return;
                    }
                    else {
                        console.log("Deleted : ", docs);
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({ 'message': 'Ati sters reteta' }, null, 4))
                        res.end()
                        return;
                    }
                });
            }
            //trimitem raspunsul la server cu datele care trebuie
            //res.writeHead(200, headers);
            //res.write(JSON.stringify({ 'message': 'Ai modificat!' }, null, 4))
            //res.end()
        }
    }
    catch (err) {
        console.log(err)
        res.writeHead(500, headers);
        res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
        res.end()
    }
}

async function filter(req, res, headers) {
    try {
        let query = req.url.split("?")[1].split("&")
        // console.log(query)
        // ingredient_exists(["rosii"])
        // ingredient_not_exists(["rosii"])
        intersect(["ulei"],["oua"])
    } catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
        res.end()
    }
}

async function intersect(include,exclude){
    let arrA = ingredient_exists(include)
    let arrB = ingredient_not_exists(exclude)
    
    let intersection = Object.values(arrA).filter(item1 => Object.values(arrB).some(item2 => item1._id === item2._id))
    console.log(intersection)
}

async function ingredient_exists(ingredients) {
    let recipes = await Recipe.find({}, 'ingredients _id')
    let regex = [];
    for (let j = 0; j < ingredients.length; j++) { //contruim regexurile pentru fiecare ingredient 
        regex[j] = new RegExp(ingredients[j].toLowerCase(), "g")
    }

    let recipes_found = [];
    let count=0;

    for (let i = 0; i < recipes.length; i++) { //parcurgem fiecare reteta
        recipes[i].ingredients.forEach(ingredient => { //parcurgem lista de ingrediente si verificam fiecare ingredient dat in parametru
            let ingred_found=0;
            for(let j=0;j<regex.length;j++){
                // console.log(element.match(regex[j]))
                let matches = ingredient.match(regex[j]) //match intre un ingredient din lista si unul dat ca parametru
                if(matches !== null){
                    // console.log(ingredient.match(regex[j]).length)
                    //recipes_found[count++] = recipes[i]._id
                    ingred_found += 1;
                }
                // if(element.match(regex[j]).length > 1)
            }

            if(ingred_found > 0){ //=== ingredients.length daca vrem sa luam toate ingredientele date la parametri
                recipes_found[count++] = recipes[i];
            }
        });
    }
    console.log(recipes_found);
    return recipes_found;
}

async function ingredient_not_exists(ingredients){
    let recipes = await Recipe.find({}, 'ingredients _id')
    let regex = [];
    for (let j = 0; j < ingredients.length; j++) { //contruim regexurile pentru fiecare ingredient 
        regex[j] = new RegExp(ingredients[j].toLowerCase(), "g")
    }

    let recipes_found = [];
    let count=0;

    for (let i = 0; i < recipes.length; i++) { //parcurgem fiecare reteta
        let index_ingredients=0; //crestem contorul daca un ingredient nu se potriveste cu niciunul dintre cele de la parametri
        recipes[i].ingredients.forEach(ingredient => { //parcurgem lista de ingrediente si verificam fiecare ingredient dat in parametru
            let ingred_found=0;
            for(let j=0;j<regex.length;j++){
                // console.log(element.match(regex[j]))
                let matches = ingredient.match(regex[j]) //match intre un ingredient din lista si unul dat ca parametru
                if(matches === null){
                    // console.log(ingredient.match(regex[j]).length)
                    //recipes_found[count++] = recipes[i]._id
                    ingred_found += 1;
                }
                // if(element.match(regex[j]).length > 1)
            }

            if(ingred_found === ingredients.length ){ //retinem reteta doar daca nu contine niciun ingredient din cele date ca parametri
                //recipes_found[count++] = recipes[i];
                index_ingredients += 1;
            }
        });

        if(index_ingredients === recipes[i].ingredients.length){
            recipes_found[count++] = recipes[i];
        }
    }
    console.log(recipes_found);
    return recipes_found;
}

function picture(req, res, headers) {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async () => {
        try {
            //   data = JSON.parse(data);
            //aici lucram cu datele primite, le prelucram etc
            console.log(data)
            var ItemSchema = new Schema(
                {
                    img:
                        { data: Buffer, contentType: String }
                }
            );
            var Item = mongoose.model('Picture', ItemSchema);

            var newItem = new Item();
            newItem.img.data = data;
            newItem.img.contentType = 'image/png';
            console.log(await newItem.save());

            console.log(Item.find({}))


            //trimitem raspunsul la server cu datele care trebuie
            res.writeHead(200, headers);
            res.write(JSON.stringify({ 'message': 'Ai adaugat!' }, null, 4))
            res.end()

        }
        catch (err) {
            console.log(err)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}

module.exports = { getMostPopular, getRecipe, addRecipe, updateRecipe, getRecipesUser, deleteRecipe, filter }
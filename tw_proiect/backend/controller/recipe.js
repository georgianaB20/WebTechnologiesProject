const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
const User = require('../models/user')
const { db } = require('../utils/constants')
let url = require('url');
// const user = require('../models/user');
// const recipe = require('../models/recipe');

const { Schema, /*model*/ } = require('mongoose');
const fs = require('fs');
const { exception } = require('console');
//const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//const { index } = require('../routes');


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
//console.log(mongoose.connection.readyState);

function compare(a, b) {
    if (a.comments.length > b.comments.length) return -1;
    if (b.comments.length > a.comments.length) return 1;
    return 0;
}

async function getMostPopular(req, res, headers) {
    try {
        let recipe2 = await Recipe.find({}, 'title description ingredients comments');
        if (recipe2 !== null) {
            recipe2.sort(compare);
            res.writeHead(200, headers);
            res.write(JSON.stringify(recipe2, null, 4))
            res.end()
        } else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'recipes not found' }, null, 4))
            res.end()
        }
    } catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'recipes not found' }, null, 4))
        res.end()
    }

}

async function getRecipe(req, res, headers) {
    let id = url.parse(req.url).query.split('&')[0] //luam id-ul pt a l folosi in query
    id = id.split('=')[1]
    try {
        let recipebyid = await Recipe.findById(id);
        if (recipebyid !== null) {
            res.writeHead(200, headers);
            res.write(JSON.stringify(recipebyid, null, 4))
            res.end()
        } else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'Reteta nu a fost gasita!' }, null, 4))
            res.end()
        }
    } catch (e) {
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
  "picture_type": "png",
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

        //TODO: TREBUIE MODIFICAT DUPA CE FACEM LOGINUL FUNCTIONAL
        data.user_id = "FICTIV"

        var multiply = (data.time_unit== "min") * 1 +
            (data.time_min_unit == "hours") * 60 +
            (data.time_min_unit == "days") * 24 * 60

        if (multiply === 0)
            time = 0
        else time = String.parseInt(data.time_value) * multiply

        data.time=time
        delete data.time_unit
        delete data.time_value

        var buf = Buffer.from(data.picture, 'base64');

        data.picture = "";

        let no_ingredients = Object.keys(data).length - 6;
        let ingredient = [];

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
        new_recipe.save(async function(err) {
            if (err) {
                console.log(err);
                res.writeHead(500, headers);
                res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                res.end()
            } else {
                filename = new_recipe._id
                fs.writeFile('./images/' + filename + '.' + data.picture_type, buf, function(err) { console.log(err); })
                new_recipe.picture = './images/' + filename + '.' + data.picture_type
                let ok = await new_recipe.save()
                if (ok === new_recipe) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ "message": "Reteta adaugata cu succes!" }, null, 4))
                    res.end()
                } else {
                    console.log(ok);
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }
            }
        });
    })

}

async function getRecipesUser(req, res, headers) { //returns a json with all reciepes from a user, by username
    try {
        if (req.url.split("?")[1].split('=')[0] == 'username') {
            let user = req.url.split("?")[1].split('=')[1]
            let userexists = await User.findOne({ username: user })
                //let recipebyid = await Recipe.findById(id);
            let recipes = await Recipe.find({ username: user })
            var len = recipes.length
            if (userexists === null) {
                res.writeHead(404, headers)
                res.write(JSON.stringify({ "message": "Userul nu exista!" }, null, 4));
                res.end();
            } else
            if (len === 0) {
                res.writeHead(404, headers)
                res.write(JSON.stringify({ "message": "Userul nu are retete" }, null, 4));
                res.end();
            } else {
                res.writeHead(200, headers)
                res.write(JSON.stringify(recipes, null, 4));
                res.end();
            }
        } else {
            res.writeHead(400, headers); //bad request, nu se pot afisa retetele unui user decat cautate dupa username
            res.write(JSON.stringify({ "message": "Nu puteti cauta retetele unui user decat dupa username-ul acestuia!" }, null, 4));
            res.end();
        }
    } catch (e) {
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
    req.on('end', async() => {
        try {
            data = JSON.parse(data);
            //aici lucram cu datele primite, le prelucram etc
            console.log(data)
            if (userid === undefined || recipeid === undefined) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'URL invalid.' }, null, 4))
                res.end()
            } else {
                let user = await User.findById(userid) //daca nu gaseste=null
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
                } else {
                    //console.log()
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }
            }

        } catch (err) {
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
        } else {
            let user = await User.findById(userid) //daca nu gaseste=null
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
            if (!(user._id === recipe.user_id || (user.type === 'admin'))) {
                res.writeHead(422, headers);
                res.write(JSON.stringify({ 'message': 'Nu puteti sterge aceasta reteta.' }, null, 4))
                res.end()
            } else {
                Recipe.findByIdAndDelete(recipeid, function(err, docs) {
                    if (err) {
                        console.log(err)
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare de la baza de date' }, null, 4))
                        res.end()
                    } else {
                        console.log("Deleted : ", docs);
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({ 'message': 'Ati sters reteta' }, null, 4))
                        res.end()
                    }
                });
            }
            //trimitem raspunsul la server cu datele care trebuie
            //res.writeHead(200, headers);
            //res.write(JSON.stringify({ 'message': 'Ai modificat!' }, null, 4))
            //res.end()
        }
    } catch (err) {
        console.log(err)
        res.writeHead(500, headers);
        res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
        res.end()
    }
}

async function filter(req, res, headers) {
    try {
        const baseURL = 'http://' + req.headers.host + '/';
        const parsedUrl = new URL(req.url, baseURL);

        const diff_map = {
            '^Easy$': parsedUrl.searchParams.get('diff_easy') === "1",
            '^Medium$': parsedUrl.searchParams.get('diff_medium') === "1",
            '^Hard$': parsedUrl.searchParams.get('diff_hard') === "1",
            '^Master Chef$': parsedUrl.searchParams.get('diff_master') === "1"
        }
        let regex_diff = Object.keys(diff_map).reduce(function(acc, key) {
            if (diff_map[key] == true) {
                if (acc !== "")
                    acc += "|";
            }
            return acc;
        });

        var multiply = (parsedUrl.searchParams.get('time_min_unit') == "min") * 1 +
            (parsedUrl.searchParams.get('time_min_unit') == "hours") * 60 +
            (parsedUrl.searchParams.get('time_min_unit') == "days") * 24 * 60

        if (multiply === 0)
            time_min = 0
        else time_min = String.parseInt(parsedUrl.searchParams.get('time_min_value')) * multiply

        multiply = (parsedUrl.searchParams.get('time_max_unit') == "min") * 1 +
            (parsedUrl.searchParams.get('time_max_unit') == "hours") * 60 +
            (parsedUrl.searchParams.get('time_max_unit') == "days") * 24 * 60

        if (multiply === 0)
            time_max = Recipe.find().sort({ time: -1 }).limit(1)
        else time_max = String.parseInt(parsedUrl.searchParams.get('time_max_value')) * multiply

        let entries = await Recipe.find({ difficulty: { $regex: regex_diff, $options: "i" }, time: { '$gte': time_min, '$lte': time_max } })

        res.writeHead(200, headers);
        res.write(JSON.stringify(apply_include_exclude(entries, parsedUrl.searchParams.get('include'), parsedUrl.searchParams.get('exclude'))));
        res.end()
    } catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
        res.end()
    }
}

function apply_include_exclude(recipes, includeString, excludeString) {
    let includeList = includeString.split(",")
    let excludeList = excludeString.split(",")
    let finalList = recipes.reduce(function(arr, recipe) {
        let numberOfIncludedIngredients = recipe.ingredients.reduce(function(currentNumber, ingredient) {
            if (includeList.find(element => element.includes(ingredient)) !== undefined)
                return currentNumber + 1;
            return currentNumber;
        }, 0)

        let numberOfExcludedIngredients = recipe.ingredients.reduce(function(currentNumber, ingredient) {
            if (excludeList.find(element => element.includes(ingredient) !== undefined))
                return currentNumber + 1;
            return currentNumber;
        }, 0)

        if (numberOfExcludedIngredients === 0 && numberOfIncludedIngredients === includeList.length)
            arr.push(recipe);

        return arr;
    }, [])

    return finalList
}

function search(req, res, headers) {
    try {
        const baseURL = 'http://' + req.headers.host + '/';
        const parsedUrl = new URL(req.url, baseURL);

        let search_terms = parsedUrl.searchParams.get('data');
        console.log(search_terms);
        let last_index = 0;
        search_terms = search_terms.split(" ")

        for (let i = 0; i < search_terms.length; i++) {
            if (search_terms[i] !== undefined && search_terms[i].length > 0) {
                let conj_regex = new RegExp(' si | sau | la | de | iar | dar | astfel | insa | ci | ca | sa | ori | fie | cu ', "g")
                console.log((" " + search_terms[i] + " "))
                if ((" " + search_terms[i] + " ").match(conj_regex) !== null) {
                    delete search_terms[i]
                    i = i - 1
                }
            } else {
                search_terms.splice(i, 1)
                i = i - 1
            }
        }
        console.log("de aici", search_terms)

        // let regex = [];
        let regex_string = ""
        for (let j = 0; j < search_terms.length; j++) { //contruim regexurile pentru fiecare ingredient 
            regex_string += search_terms[j].toLowerCase()
            if (j != search_terms.length - 1)
                regex_string += "|"
        }

        // let re
        let recipes = Recipe.aggregate([{
                $match: {
                    title: { $regex: regex_string }
                }
            },
            {
                $unionWith: {
                    coll: 'recipes',
                    pipeline: [{
                        $match: {
                            description: { $regex: regex_string }
                        }
                    }]
                }
            }

        ], function(err, data) {
            for (let i = 0; i < data.length; i++)
                console.log(data[i].title)
            if (data.length > 0) {
                res.writeHead(200, headers)
                res.write(JSON.stringify(data, null, 4));
                res.end();
            } else {
                res.writeHead(404, headers)
                res.write(JSON.stringify({ "message": "Nu s-a gasit nicio reteta" }, null, 4));
                res.end();
            }
        });


    } catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
        res.end()
    }
}

module.exports = { getMostPopular, getRecipe, addRecipe, updateRecipe, getRecipesUser, deleteRecipe, filter, search }
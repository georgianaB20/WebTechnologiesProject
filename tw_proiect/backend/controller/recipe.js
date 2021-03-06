const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
const Ingredient = require('../models/ingredient')
const User = require('../models/user')
const Filter = require('../models/filter')
const { db, key, images_server_url } = require('../utils/constants')
const jwt = require('jsonwebtoken')
let url = require('url');
const fs = require('fs');

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const ingredient = require('../models/ingredient');


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

function compare(a, b) {
    if (a.comments.length > b.comments.length) return -1;
    if (b.comments.length > a.comments.length) return 1;
    return 0;
}

async function getRecipes(req, res, headers) {
    // http://localhost:5000/recipes?q=supa%20rosii

    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);
    const query = parsedUrl.searchParams.get('q');

    try {
        const filter = {};
        if (query) {
            filter.$text = { $search: query };
        }
        let recipe2 = await Recipe.find(filter);
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

async function addRecipe(req, res, headers) {
    let auth = req.headers.authorization
    let decoded, user_id
    try {
        decoded = jwt.verify(auth, key)
            //decoded.user_id to get the user_id
        user_id = decoded.user_id
    } catch (err) {
        res.writeHead(401, headers);
        res.write(JSON.stringify({ "message": "Nu sunteti logat" }, null, 4));
        res.end();
        return;
    }

    //verificam daca userul poate posta retete
    let user = await User.findById(user_id)
    if (user === null) {
        res.writeHead(404, headers);
        res.write(JSON.stringify({ "message": "Userul nu exista" }, null, 4));
        res.end();
        // return;
    } else if (user.can_post === "no") {
        res.writeHead(403, headers);
        res.write(JSON.stringify({ 'message': 'Userul este restrictionat!' }, null, 4))
        res.end()
    } else {

        let data = ''

        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            data = JSON.parse(data);

            data.user_id = user_id

            var base64 = data.picture

            let no_ingredients = Object.keys(data).length - 6;
            let ingredient = [];

            for (let i = 1; i <= no_ingredients; i++) {
                if (data["ingredient" + i] !== "" && data["ingredient" + i] !== null && data["ingredient" + i] !== undefined) {
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

            if (data.time_unit === "min") {
                data.time = parseInt(data.time_value)
            } else if (data.time_unit === "h") {
                data.time = parseInt(data.time_value) * 60
            } else if (data.time_unit === "d") {
                data.time = parseInt(data.time_value) * 24 * 60
            }
            delete data.time_value
            delete data.time_unit
            delete data.picture
            let new_recipe = new Recipe(data);


            new_recipe.save(async function(err) {
                if (err) {
                    console.log(err);
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                } else {
                    new_recipe.user_id = user_id
                    filename = new_recipe._id

                    let req = new XMLHttpRequest();
                    let path = '/images/' + filename + '.' + (data.picture_type.split('/')[1])
                    let body = { 'name': path, 'base64': base64 }

                    req.open("POST", images_server_url);

                    req.setRequestHeader("Content-Type", "application/json");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Access-Control-Allow-Origin", "*");

                    req.onload = async function() {
                        if (req.status === 200) {
                            new_recipe.picture = path
                            new_recipe.picture_type = data.picture_type
                            let ok = await new_recipe.save()
                            if (ok === new_recipe) {
                                res.writeHead(200, headers);
                                res.write(JSON.stringify({ _id: ok._id }, null, 4))
                                res.end()
                            } else {
                                res.writeHead(500, headers);
                                res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                                res.end()
                            }
                        } else if (req.status === 500) {
                            res.writeHead(500, headers);
                            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                            res.end()
                        }
                    }
                    req.send(JSON.stringify(body));
                }
            });
        })
    }
}

async function getRecipesUser(req, res, headers) { //returns a json with all reciepes from a user, by user_id
    let auth = req.headers.authorization
    let decoded, user_id
    try {
        decoded = jwt.verify(auth, key)
            //decoded.user_id to get the user_id
        user_id = decoded.user_id
    } catch (err) {
        res.writeHead(401, headers);
        res.write(JSON.stringify({ "message": "Nu sunteti logat" }, null, 4));
        res.end();
        return;
    }
    try {
        // if (req.url.split("?")[1].split('=')[0] == 'username') {
        //     let user = req.url.split("?")[1].split('=')[1]
        //     let userexists = await User.findOne({ username: user })
        //         //let recipebyid = await Recipe.findById(id);
        //     let recipes = await Recipe.find({ username: user })

        if (user_id !== null && user_id !== undefined) {
            let userexists = await User.findById(user_id)
                //let recipebyid = await Recipe.findById(id);
            let recipes = await Recipe.find({ user_id: user_id })
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
            res.write(JSON.stringify({ "message": "Nu puteti cauta retetele! ID gresit." }, null, 4));
            res.end();
        }
    } catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Eroare interna.' }, null, 4))
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

                let ok = await recipe.save()

                if (ok === recipe) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Reteta actualizata!' }, null, 4))
                    res.end()
                } else {
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
        let auth = req.headers.authorization
        let decoded, userid
        try {
            decoded = jwt.verify(auth, key)
                //decoded.user_id to get the user_id
            userid = decoded.user_id
        } catch (err) {
            res.writeHead(401, headers);
            res.write(JSON.stringify({ "message": "Nu sunteti logat" }, null, 4));
            res.end();
            return;
        }
        // let userid = req.url.split('?')[1].split('&')[0].split('=')[1]
        let recipeid = req.url.split('?')[1].split('=')[1]


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
            if (!(user._id.toString() !== recipe.user_id || (user.type !== 'admin'))) {
                res.writeHead(422, headers);
                res.write(JSON.stringify({ 'message': 'Nu puteti sterge aceasta reteta.' }, null, 4))
                res.end()
            } else {
                Recipe.findByIdAndDelete(recipeid, function(err, docs) {
                    if (err) {
                        console.log(err)
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare interna' }, null, 4))
                        res.end()
                    } else {

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

        let include = parsedUrl.searchParams.get('include')
        let exclude = parsedUrl.searchParams.get('exclude')
        let order_by = parsedUrl.searchParams.get('order_by')
        let order = parsedUrl.searchParams.get('order')
            //adaugam filterCookie in db la noi pt un user logat si il adaugam in local storage pt un user nelogat

        //{user_id,filterCookie}

        if (include === null)
            include = ""
        if (exclude === null)
            exclude = ""
        if (order_by === null)
            order_by = ""
        if (order === null)
            order = ""

        var include_exclude_flag = false,
            sort_flag = false
        if (include !== "" || exclude !== "")
            include_exclude_flag = true
        if (parsedUrl.searchParams.get('order_by') !== "" && parsedUrl.searchParams.get('order') !== "")
            sort_flag = true

        if (include_exclude_flag && sort_flag) {
            res.writeHead(400, headers)
            res.write(JSON.stringify({ "message": "Nu puteti selecta si criterii de includere/excludere si criterii de sortare. Va rugam selectati doar una din categoriile de criterii." }))
            res.end()
            return
        }

        if (sort_flag === false && (parsedUrl.searchParams.get('order_by') === "" || parsedUrl.searchParams.get('order') === "") && !(parsedUrl.searchParams.get('order_by') === "" && parsedUrl.searchParams.get('order') === "")) {
            res.writeHead(400, headers)
            res.write(JSON.stringify({ "message": "Pentru sortare e nevoie sa selectati atat ordinea, cat si criteriul de sortare." }))
            res.end()
            return
        }

        const diff_map = {
            '^Usor$': parsedUrl.searchParams.get('diff_easy') === "1",
            '^Mediu$': parsedUrl.searchParams.get('diff_medium') === "1",
            '^Greu$': parsedUrl.searchParams.get('diff_hard') === "1",
            '^Master Chef$': parsedUrl.searchParams.get('diff_master') === "1"
        }

        // let regex_diff = Object.keys(diff_map).reduce(function(acc, key) {

        let regex_diff = Object.keys(diff_map).reduce(function(acc, key) {
            if (diff_map[key] === true) {
                if (acc !== "")
                    acc += "|"
                acc += key
            }
            return acc;
        }, "");

        var multiply = (parsedUrl.searchParams.get('time_min_unit') == "min") * 1 +
            (parsedUrl.searchParams.get('time_min_unit') == "hours") * 60 +
            (parsedUrl.searchParams.get('time_min_unit') == "days") * 24 * 60
        if (multiply === 0)
            time_min = 0
        else time_min = parseInt(parsedUrl.searchParams.get('time_min_value')) * multiply


        multiply = (parsedUrl.searchParams.get('time_max_unit') == "min") * 1 +
            (parsedUrl.searchParams.get('time_max_unit') == "hours") * 60 +
            (parsedUrl.searchParams.get('time_max_unit') == "days") * 24 * 60

        if (multiply === 0) {
            recipe = await Recipe.find().sort({ time: -1 }).limit(1)
            time_max = recipe[0].time
        } else time_max = parseInt(parsedUrl.searchParams.get('time_max_value')) * multiply

        let entries = await Recipe.find({ difficulty: { $regex: regex_diff, $options: "i" }, time: { '$gte': time_min, '$lte': time_max } })

        res.writeHead(200, headers);
        res.write(JSON.stringify(apply_include_exclude_sort(entries, include, exclude, parsedUrl.searchParams.get('order_by'), parsedUrl.searchParams.get('order'))));
        res.end()
    } catch (e) {
        console.log(e)
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
        res.end()
    }
}

function apply_include_exclude_sort(recipes, includeString, excludeString, order_by, order) {
    let includeList = includeString.split(",")
    if (includeString === "") {
        includeList = []
    } else {
        //request cu put in bd ca sa salvam ingredientul
        includeList.forEach(element => {
            insert_update_ingredient(element, "include")
        });
    }
    let excludeList = excludeString.split(",")
    if (excludeString === "") {
        excludeList = []
    } else {
        //request cu put in bd ca sa salvam ingredientul
        excludeList.forEach(element => {
            insert_update_ingredient(element, "exclude")
        });
    }
    order = (order === "ASC") ? -1 : 1
        // let listAfterIncludeExclude = recipes.reduce(function(arr, recipe) {
        //     let numberOfIncludedIngredients = recipe.ingredients.reduce(function(currentNumber, ingredient) {

    let listAfterIncludeExclude = recipes.reduce(function(arr, recipe) {
        let numberOfIncludedIngredients = recipe.ingredients.reduce(function(currentNumber, ingredient) {
            if (includeList.find(element => ingredient.includes(element)) !== undefined)
                return currentNumber + 1;
            return currentNumber;
        }, 0)

        // let numberOfExcludedIngredients = recipe.ingredients.reduce(function(currentNumber, ingredient) {

        let numberOfExcludedIngredients = recipe.ingredients.reduce(function(currentNumber, ingredient) {
            if (excludeList.find(element => ingredient.includes(element)) !== undefined)
                return currentNumber + 1;
            return currentNumber;
        }, 0)
        if (numberOfExcludedIngredients === 0 && numberOfIncludedIngredients === includeList.length)
            arr.push({ 'recipe': recipe, 'extra_ingredients': recipe.ingredients.length - includeList.length });

        return arr;
    }, [])

    // let difficulties = ['Usor', 'Mediu', 'Greu', 'Master Chef']

    let difficulties = ['Usor', 'Mediu', 'Greu', 'Master Chef']

    let finalList = listAfterIncludeExclude
    finalList.sort(function(el1, el2) {
        if (order_by === "") {
            if (el1.extra_ingredients < el2.extra_ingredients)
                return -1;
            if (el1.extra_ingredients > el2.extra_ingredients)
                return 1;
            return 0;
        }
        if (order_by === "popularity") {
            if (el1.recipe.comments.length < el2.recipe.comments.length)
                return -order;
            return order;
        }
        if (order_by === "difficulty") {
            return (difficulties.indexOf(el1.recipe.difficulty) - difficulties.indexOf(el2.recipe.difficulty)) * (-order)
        }

        if (el1.recipe[order_by] < el2.recipe[order_by])
            return order;
        return -order;
    })

    return finalList
}

function search(req, res, headers) {
    try {
        const baseURL = 'http://' + req.headers.host + '/';
        const parsedUrl = new URL(req.url, baseURL);

        let search_terms = parsedUrl.searchParams.get('data');
        let last_index = 0;
        search_terms = search_terms.split(" ")

        for (let i = 0; i < search_terms.length; i++) {
            if (search_terms[i] !== undefined && search_terms[i].length > 0) {
                let conj_regex = new RegExp(' si | sau | la | de | iar | dar | astfel | insa | ci | ca | sa | ori | fie | cu ', "g")
                if ((" " + search_terms[i] + " ").match(conj_regex) !== null) {
                    delete search_terms[i]
                    i = i - 1
                }
            } else {
                search_terms.splice(i, 1)
                i = i - 1
            }
        }

        let regex_string = ""
        for (let j = 0; j < search_terms.length; j++) { //contruim regexurile pentru fiecare ingredient 
            regex_string += search_terms[j].toLowerCase()
            if (j != search_terms.length - 1)
                regex_string += "|"
        }

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


async function insert_update_ingredient(iname, type) {
    iname = iname.toLowerCase().trim()
    let ingredient = await Ingredient.findOne({name: iname})
    if (ingredient === null) {
        if (type === "include")
            ingredient = new Ingredient({ name: iname, includes: 1, excludes: 0 })
        else if (type === "exclude")
            ingredient = new Ingredient({ name: iname, includes: 0, excludes: 1 })
        let ok = await ingredient.save()
    } else {
        if (type === "include")
            ingredient.includes = ingredient.includes + 1
        else if (type === "exclude")
            ingredient.excludes = ingredient.excludes + 1
        let ok = await ingredient.save()
    }
}

async function getFilter(req, res, headers) {
    let auth = req.headers.authorization
    let decoded, user_id
    try {
        decoded = jwt.verify(auth, key)
            //decoded.user_id to get the user_id
        user_id = decoded.user_id
    } catch (err) {
        console.log(err)
        res.writeHead(401, headers);
        res.write(JSON.stringify({ "message": "Nu sunteti logat" }, null, 4));
        res.end();
        return;
    }

    let filter = await Filter.findOne({ user_id: decoded.user_id })

    if (filter !== null) {
        res.writeHead(200, headers);
        res.write(JSON.stringify(filter, null, 4));
        res.end();
    } else {
        res.writeHead(404, headers);
        res.end();
    }
}

async function insertFilter(req, res, headers) {
    let auth = req.headers.authorization
    let decoded, user_id
    try {
        decoded = jwt.verify(auth, key)
            //decoded.user_id to get the user_id
        user_id = decoded.user_id
    } catch (err) {
        console.log(err)
        res.writeHead(401, headers);
        res.write(JSON.stringify({ "message": "Nu sunteti logat" }, null, 4));
        res.end();
        return;
    }
    let data = ""
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async() => {
        try {

            data = JSON.parse(data);
            data.user_id = user_id
            let variabila = new Filter(data)
            let filter1 = await Filter.findOne({ user_id: data.user_id })

            if (filter1 === null) {
                let ok = await variabila.save()
                if (ok === variabila) {
                    res.writeHead(200, headers)
                    res.end();
                } else {
                    res.writeHead(500, headers)
                    res.end();
                }
            } else {
                filter1.diff_easy = data.diff_easy
                filter1.diff_medium = data.diff_medium
                filter1.diff_hard = data.diff_hard
                filter1.diff_master = data.diff_master
                filter1.exclude = data.exclude
                filter1.include = data.include
                filter1.order = data.order
                filter1.order_by = data.order_by
                filter1.time_max_unit = data.time_max_unit
                filter1.time_max_value = data.time_max_value
                filter1.time_min_unit = data.time_min_unit
                filter1.time_min_value = data.time_min_value


                let ok = await filter1.save()
                if (ok === filter1) {
                    res.writeHead(200, headers)
                    res.end();
                } else {
                    res.writeHead(500, headers)
                    res.end();
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


module.exports = { getMostPopular: getRecipes, getRecipe, addRecipe, updateRecipe, getRecipesUser, deleteRecipe, filter, search, getFilter, insertFilter }
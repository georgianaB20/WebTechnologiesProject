const Ingredient = require('../models/ingredient')
const Recipe = require('../models/recipe')
const { db, key, images_server_url } = require('../utils/constants')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

function compare_include(a, b) {
    if (a.includes < b.includes) return 1;
    if (a.includes > b.includes) return -1;
    return 0;
}

function compare_exclude(a, b) {
    if (a.excludes < b.excludes) return 1;
    if (a.excludes > b.excludes) return -1;
    return 0;
}

function compare(a, b) {
    if (a.comments.length > b.comments.length) return -1;
    if (b.comments.length > a.comments.length) return 1;
    return 0;
}


async function update(req, res, headers) {
    //Luate retetele dupa popularitate, ingredientele dupa gradul de preferatie/evitare, si salvate in liste
    let includes_ranking = (await Ingredient.find({}, 'name includes excludes')).sort(compare_include)
    let excludes_ranking = (await Ingredient.find({}, 'name includes excludes')).sort(compare_exclude)
    let most_popular_ranking = (await Recipe.find({}, 'title description ingredients comments')).sort(compare)
    let aincludes = []
    let aexcludes = []
    let popular_recipes = []

    for (let i = 0; i < includes_ranking.length; i++) {
        // delete includes_ranking[i]._id
        aincludes.push({ name: includes_ranking[i].name, includes: includes_ranking[i].includes, excludes: includes_ranking[i].excludes })
    }

    for (let i = 0; i < excludes_ranking.length; i++) {
        aexcludes.push({ name: excludes_ranking[i].name, excludes: excludes_ranking[i].excludes, includes: excludes_ranking[i].includes })
    }

    for (let i = 0; i < most_popular_ranking.length; i++) {
        if (i < 10)
            popular_recipes.push({
                titlu: most_popular_ranking[i].title,
                ingrediente: most_popular_ranking[i].ingredients,
                descriere: most_popular_ranking[i].description,
                popularitate: most_popular_ranking[i].comments.length
            })
    }

    //Request la 7001, cu listele updatate (PUT)
    let request = new XMLHttpRequest();
    let path = '/files/ingrediente'
    let body = { name: path, includes: aincludes, excludes: aexcludes, retete: popular_recipes }

    request.open("POST", images_server_url + path);

    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Access-Control-Allow-Origin", "*");

    request.onload = async function() {
        if (request.status === 200) {
            res.writeHead(200, headers);
            res.write(JSON.stringify({ 'message': 'OK' }, null, 4))
            res.end()

        } else if (request.status === 500) {
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    }
    request.send(JSON.stringify(body));
}

module.exports = { update }
const mongoose = require('mongoose');
const lodash = require('lodash')

const Recipe = require('../models/recipe')
const User = require('../models/user')
const Comment = require('../models/comment')
const { db, images_server_url, key } = require('../utils/constants');
const { getRecipesUser } = require('./recipe');
const jwt = require('jsonwebtoken')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

async function getComments(req, res, headers) {
    // http://localhost:5000/comment?recipe_id=60ad6b4b11055631b080bdde

    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);
    const recipe_id = parsedUrl.searchParams.get('recipe_id');

    try {
        let recipe_by_id = await Recipe.findById(recipe_id);
        if (recipe_by_id !== null) {
            if ('comments' in recipe_by_id) {
                await recipe_by_id.populate('comments').execPopulate();
                res.writeHead(200, headers);
                res.write(JSON.stringify(recipe_by_id.comments, null, 4))
                res.end()
            }
        } else {
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'Reteta nu a fost gasita!' }, null, 4))
            res.end()
        }
    } catch (e) {
        console.log(e);
        res.writeHead(500, headers);
        res.write(JSON.stringify({ 'message': 'Eroare la server!' }, null, 4))
        res.end()
    }
}

async function addComment(req, res, headers) {
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

    let user = await User.findById(user_id)

    if (user === null) {
        res.writeHead(401, headers);
        res.write(JSON.stringify({ 'message': 'Nu sunteti logat, nu puteti comenta la reteta!' }, null, 4))
        res.end()
    } else if (user.can_comment === 'no') {
        res.writeHead(403, headers)
        res.write(JSON.stringify({ 'message': 'Nu aveti drepturi suficiente pentru a putea comenta!' }))
        res.end()
    } else {

        let data = '';

        req.on('data', chunk => {
            data += chunk;
        })

        req.on('end', async () => {
            try {
                data = JSON.parse(data);
                let recipe_id = data.rid
                let base64 = data.picture

                let recipe = await Recipe.findById(recipe_id)

                if (recipe === null) {
                    res.writeHead(404, headers);
                    res.write(JSON.stringify({ 'message': 'Reteta nu exista!' }, null, 4))
                    res.end()
                }

                let user_commented = 0
                //adaugam comentariul la vectorul de comentarii de la reteta
                for (let i = 0; i < recipe.comments.length; i++) {
                    if (JSON.stringify(recipe.comments[i].user_id) === user_id) {
                        // userul a comentat deja la reteta asta
                        res.writeHead(409, headers);
                        res.write(JSON.stringify({ 'message': 'Ati comentat deja la aceasta reteta.' }, null, 4))
                        res.end()
                        user_commented = 1
                        break;
                    }
                }
                if (user_commented === 0) {
                    //adaugam comentariul
                    let _id = new mongoose.Types.ObjectId().toString()
                    let filename = _id
                    let path = '/images/' + filename + '.' + data.picture_type.split("/")[1]
                    let comment = { "_id": _id, "user_id": user_id, "username": user.username, "picture": path, 'text': data.comentariu }
                    recipe.comments.push(comment)

                    let req = new XMLHttpRequest()
                    let body = { 'name': path, 'base64': base64 }
                    req.open("POST", images_server_url);

                    req.setRequestHeader("Content-Type", "application/json");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Access-Control-Allow-Origin", "*");

                    req.onload = async function () {
                        if (req.status === 200) {
                            await recipe.save(function (err, recipeWithNewComment) {
                                if (err) {
                                    console.log(err);
                                    res.writeHead(500, headers);
                                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                                    res.end()
                                    return
                                }
                                
                                if (recipeWithNewComment === recipe) {
                                    res.writeHead(200, headers);
                                    res.write(JSON.stringify({ "message": "Comentariu adaugat cu succes!" }, null, 4))
                                    res.end()
                                } else {
                                    res.writeHead(500, headers);
                                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                                    res.end()
                                }
                            })
                        }
                    }
                    req.send(JSON.stringify(body))
                }
            } catch (e) {
                console.log(e)
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
                res.end()
            }
        })
    }
}

async function deleteComment(req, res, headers) {
    // http://localhost:5000/comment?recipe_id=60ad6b4b11055631b080bdde&user_id=6095a5284b2d712af8aeb170&comment_id=60b1006f6efbf92440ab2cfa
    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);
    const recipe_id = parsedUrl.searchParams.get('recipe_id');
    const user_id = parsedUrl.searchParams.get('user_id')
    const comment_id = parsedUrl.searchParams.get('comment_id')

    if (!(comment_id === undefined || recipe_id === undefined || user_id === undefined)) {
        try {
            let user_by_id = await User.findById(user_id) //daca nu gaseste=null
            let recipe_by_id = await Recipe.findById(recipe_id)
            // let comment_by_id = await Comment.findById(comment_id)

            if (user_by_id === null) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Userul nu exista' }, null, 4))

            }

            if (recipe_by_id === null) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Reteta nu exista' }, null, 4))
                res.end()
            }

            let comment = null;
            for (let i = 0; i < recipe_by_id.comments.length; i++) {
                if (lodash.isEqual(recipe_by_id.comments[i].user_id, user_by_id._id))
                    comment = recipe_by_id.comments[i]
            }

            if (comment !== null) {
                //userul este cel care a postat comentariul sau un admin/moderator
                if (!(user_id === JSON.stringify(comment.user_id) || (user.type === 'admin' || user.type === 'moderator'))) {
                    res.writeHead(422, headers);
                    res.write(JSON.stringify({ 'message': 'Nu puteti sterge aceasta reteta.' }, null, 4))
                    res.end()
                } else {
                    recipe_by_id.comments.pull(comment);
                    await recipe_by_id.save();
                }
            } else {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Comentariul nu este la reteta asta!' }, null, 4))
                res.end()
            }
        } catch (e) {
            console.log(e)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'URL invalid.' }, null, 4))
        res.end()
    }
}


module.exports = { getComments, addComment, deleteComment }
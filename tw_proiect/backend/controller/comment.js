const mongoose = require('mongoose');
const lodash = require('lodash')

const Recipe = require('../models/recipe')
const User = require('../models/user')
const Comment = require('../models/comment')
const { db } = require('../utils/constants');
const { getRecipesUser } = require('./recipe');


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
                // console.log(recipe_by_id.comments);
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
    // http://localhost:5000/comment?recipe_id=60ad6b4b11055631b080bdde&user_id=6099a85c85afd46d920f4fbd

    const baseURL = 'http://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);
    // let recipe_id = parsedUrl.searchParams.get('recipe_id');
    // let user_id = parsedUrl.searchParams.get('user_id')

    // let recipe_by_id = await Recipe.findById(recipe_id);

    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })

    req.on('end', async() => {
        try {
            // data.picture = "";

            data = JSON.parse(data);
            let recipe_id = data.rid
            let user_id = data.uid

            let recipe = await Recipe.findById(recipe_id)
            let user = await User.findById(user_id)

            if (user === null) {
                res.writeHead(409, headers);
                res.write(JSON.stringify({ 'message': 'Nu sunteti inregistrat, nu puteti comenta la reteta!' }, null, 4))
                res.end()
            } else if (recipe === null) {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Reteta nu exista!' }, null, 4))
                res.end()
            } else {
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
                    let buf = Buffer.from(data.picture, 'base64');
                    let _id = new ObjectId().toString()
                    filename = _id
                    fs.writeFile('./images/' + filename + '.' + data.picture_type, buf, function(err) { console.log(err); })
                    let comment = { "_id": _id, "user_id": user_id, "picture": './images/' + filename + '.' + data.picture_type }
                    recipe.comments.push(comment)

                    let saved = await recipe.save()
                    if (saved === recipe) {
                        //succes
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({ "message": "Comentariu adaugat cu succes!" }, null, 4))
                        res.end()
                    } else {
                        //eroare
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                        res.end()
                    }
                }
            }
        } catch (e) {
            console.log(e)
            res.writeHead(404, headers);
            res.write(JSON.stringify({ 'message': 'Eroare!' }, null, 4))
            res.end()
        }

        // const new_comment = new Comment(data);
        // new_comment.user_id = user_id;

        // new_comment.save(function(err) {
        //     if (err) {
        //         console.log(err);
        //         res.writeHead(500, headers);
        //         res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
        //         res.end()
        //     } else {
        //         res.writeHead(200, headers);
        //         res.write(JSON.stringify({ "message": "Comentariu adaugat cu succes!" }, null, 4))
        //         res.end()
        //     }
        // });

        // console.log(recipe_by_id);
        // console.log(new_comment._id)

        // await Recipe.updateOne({ _id: mongoose.Types.ObjectId(recipe_id) }, {
        //     $push: { comments: new_comment._id }
        // })
    })
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

            // console.log(comment_by_id.user_id);
            // console.log(user_by_id._id);
            //
            // console.log(typeof(comment_by_id.user_id))
            // console.log(typeof user_by_id._id)
            //
            // console.log(lodash.isEqual(comment_by_id.user_id, user_by_id._id))
            let comment = null;
            for (let i = 0; i < recipe_by_id.comments.length; i++) {
                if (lodash.isEqual(recipe_by_id.comments[i].user_id, user_by_id._id))
                    comment = recipe_by_id.comments[i]
            }

            // if (lodash.isEqual(comment_by_id.user_id, user_by_id._id)) {
            //     try {
            //         let recipe_by_id = await Recipe.findById(recipe_id);

            //         if (recipe_by_id === null) {
            //             res.writeHead(404, headers);
            //             res.write(JSON.stringify({ 'message': 'Userul nu a fost gasit!' }, null, 4))
            //             res.end()
            //             return;
            //         }

            //         const idx = recipe_by_id.comments.some(el => el.equals(comment_by_id._id))
            //if(idx){
            if (comment !== null) {
                //userul este cel care a postat comentariul sau un admin/moderator
                if (!(user_id === JSON.stringify(comment.user_id) || (user.type === 'admin' || user.type === 'moderator'))) {
                    res.writeHead(422, headers);
                    res.write(JSON.stringify({ 'message': 'Nu puteti sterge aceasta reteta.' }, null, 4))
                    res.end()
                } else {
                    recipe_by_id.comments.pull(comment);
                    await recipe_by_id.save();
                    console.log('comentariu sters din reteta')
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

        //     Comment.findByIdAndDelete(comment_by_id._id, function(err, docs) {
        //         if (err) {
        //             console.log(err)
        //             res.writeHead(500, headers);
        //             res.write(JSON.stringify({ 'message': 'Eroare de la baza de date' }, null, 4))
        //             res.end()
        //         } else {
        //             console.log("Deleted : ", docs);
        //             res.writeHead(200, headers);
        //             res.write(JSON.stringify({ 'message': 'Ati sters comentariul' }, null, 4))
        //             res.end()
        //         }
        //     });
        // } else {
        //     res.writeHead(401, headers);
        //     res.write(JSON.stringify({ 'message': 'Comentariul nu a fost adaugat de acest utilizator' }, null, 4))
        //     res.end()
        // }
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'URL invalid.' }, null, 4))
        res.end()
    }
}


module.exports = { getComments, addComment, deleteComment }
const mongoose = require('mongoose')
const User = require('../models/user')
const { db } = require('../utils/constants')
const md5 = require('crypto-js/md5')
let url = require('url')
mongoose.set('useFindAndModify', false);

/*json sample for testing login

{
  "username":"georgiana",
  "password":"parola1234"  
}

*/

function login(req, res, headers) {
    //console.log(mongoose.connection.readyState);
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async() => {
        try {
            data = JSON.parse(data);
            let user = await User.findOne({ "username": data.username }, '_id') //ca sa verificam daca userul exista
            let user2 = await User.findOne({ "username": data.username, "password": md5(data.password) }) //verificam daca parola este corecta
                //console.log(user2)
            if (user === null) {
                res.writeHead(500, headers);
                res.write(JSON.stringify({ 'message': 'Userul nu exista' }, null, 4))
                res.end()
            } else if (user2 === null) {
                res.writeHead(500, headers);
                res.write(JSON.stringify({ 'message': 'Username sau parola gresita.' }, null, 4))
                res.end()
            } else if (user2.acces === "yes") {
                res.writeHead(200, headers)
                res.write(JSON.stringify(user2, null, 4))
                res.end()
            } else {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Userul este restrictionat!' }, null, 4))
                res.end()
            }
        } catch (err) {
            console.log(err)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}



/* json sample for testing register

{
  "username":"user2",
  "email":"georgiana20@yahoo.com",
  "password" : "miaunel2",
  "confirm_password":"miaunel2",
  "other":"on" (sau "female":"on" sau "male":"on" ---> se refera la gender)
}

*/

function register(req, res, headers) {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async() => {
        try {
            data = JSON.parse(data);
            console.log(data);

            if (data.male !== undefined) {
                data.gender = 'M';
                delete data.male;
            } else if (data.female !== undefined) {
                data.gender = 'F';
                delete data.female;
            } else if (data.other !== undefined) {
                data.gender = 'Other';
                delete data.altceva;
            }

            //verificam daca emailul mai exista in BD
            let user_exists = await User.findOne({ 'email': data.email, 'username': data.username })
            if (user_exists !== null) {
                res.writeHead(400, headers);
                res.write(JSON.stringify({ 'message': 'Email-ul si numele de utilizator exista deja in baza de date.' }, null, 4))
                res.end();
            } else if (data.password !== data.confirm_password) {
                res.writeHead(422, headers);
                res.write(JSON.stringify({ 'message': 'Parolele sunt diferite.' }, null, 4))
                res.end();
            } else if (data.password.length < 8) {
                res.writeHead(422, headers);
                res.write(JSON.stringify({ 'message': 'Parola este prea scurta.' }, null, 4))
                res.end();
            } else {
                delete data.confirm_password;
                data.password = md5(data.password)

                const new_user = new User(data);
                new_user.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                        res.end()
                    } else {
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({ 'message': 'Te-ai inregistrat cu succes!' }, null, 4))
                        res.end()
                    }
                });
            }
        } catch (error) {
            console.log(error)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}


/**
json sample for testing /change?type_of_change=username
{
  "username":"user3",
  "password":"miaunel2",
  "id" : "60a2d0a2b24a5409bc9a5b73"
}

json sample for testing /change?type_of_change=password
{
  "parola_veche":"parola1234",
  "parola_noua":"parola123",
  "parola_noua2":"parola123",
  "id": "6099a85c85afd46d920f4fbd"
}

json sample for testing /change?type_of_change=email
{
  "email_vechi":"someone@yahoo.com",
  "email_nou":"someone@gmail.com",
  "parola":"parola5678",
  "id": "6099a94985afd46d920f4fbf"
}

 */

function change(req, res, headers) {
    //console.log(req.url.split('?')[1].split('=')[1])

    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async() => {
        try {
            data = JSON.parse(data);
            //console.log(req.url.split('?')[1].split('=')[1])
            let type_of_change = req.url.split('?')[1].split('=')[1]

            if (type_of_change === "username") {
                let check_pass = await User.findOne({ _id: data.id }, "password")
                let user = await User.findOne({ username: data.username }, "_id")

                if (data.username === undefined || data.password === undefined || data.id === undefined) {
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({ 'message': 'Ati trimis date incomplete!' }, null, 4))
                    res.end()
                } else if (check_pass === null) {
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Nu exista un user cu acest id!' }, null, 4))
                    res.end()
                } else if (check_pass.password !== md5(data.password)) {
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Parola incorecta!' }, null, 4))
                    res.end()
                } else if (user !== null) {
                    res.writeHead(409, headers);
                    res.write(JSON.stringify({ 'message': 'Username-ul exista deja in baza de date.' }, null, 4))
                    res.end()
                } else {
                    let update_user = await User.findByIdAndUpdate(data.id, { username: data.username })
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Username actualizat!' }, null, 4))
                    res.end()
                }

            } else if (type_of_change === "password") {
                //console.log(data);
                let user = await User.findById(data.id)
                    //console.log(user)
                    //console.log(data.id === undefined,data.parola_veche === undefined,data.parola_noua === undefined,data.parola_noua2===undefined)
                if (data.id === undefined || data.parola_veche === undefined || data.parola_noua === undefined || data.parola_noua2 === undefined) {
                    //date incomplete
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({ 'message': 'Ati trimis date incomplete!' }, null, 4))
                    res.end()
                } else if (user === null) {
                    //userul nu exista
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Nu exista un user cu acest id!' }, null, 4))
                    res.end()
                } else if (user.password !== md5(data.parola_veche)) {
                    //parola incorecta
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Parola incorecta!' }, null, 4))
                    res.end()
                } else if (data.parola_noua !== data.parola_noua2 || (data.parola_noua === data.parola_noua2 && data.parola_noua.length < 8)) {
                    //parolele noi nu coincid
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare la confirmarea parola noua sau parola noua este prea scurta!' }, null, 4))
                    res.end()
                } else {
                    //totul ok , modificam datele in BD
                    user.password = md5(data.parola_noua)
                    let ok = await user.save()
                        //console.log(ok, user)
                    if (ok === user) {
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({ 'message': 'Parola actualizata!' }, null, 4))
                        res.end()
                    } else {
                        //console.log()
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                        res.end()
                    }
                }
            } else if (type_of_change === "email") {
                let user = await User.findById(data.id)
                let user2 = await User.findOne({ "email": data.email_nou })
                if (data.email_nou === undefined || data.email_vechi === undefined || data.id === undefined || data.parola === undefined) {
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({ 'message': 'Ati trimis date incomplete!' }, null, 4))
                    res.end()
                } else if (user === null) {
                    //userul nu exista
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Nu exista un user cu acest id!' }, null, 4))
                    res.end()
                } else if (user.password !== md5(data.parola)) {
                    //parola incorecta
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Parola incorecta!' }, null, 4))
                    res.end()
                } else if (data.email_vechi !== user.email) {
                    res.writeHead(401, headers);
                    res.write(JSON.stringify({ 'message': 'Email incorect!' }, null, 4))
                    res.end()
                } else if (user2 !== null && user2.id !== user.id) {
                    res.writeHead(409, headers);
                    res.write(JSON.stringify({ 'message': 'Email-ul exista deja in baza de date!' }, null, 4))
                    res.end()
                } else {
                    user.email = data.email_nou
                    let ok = await user.save()

                    if (ok === user) {
                        res.writeHead(200, headers);
                        res.write(JSON.stringify({ 'message': 'Email actualizat!' }, null, 4))
                        res.end()
                    } else {
                        //console.log(err)
                        res.writeHead(500, headers);
                        res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                        res.end()
                    }
                }

            } else {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Not found!' }, null, 4))
                res.end()
            }

        } catch (err) {
            console.log(err)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}


/*
json sample for testing /grant?type={type_of_grant} , where {type_of_grant} = comments | post | access | moderator
                        /restrict?type={type_of_restrict} , where  {type_of_restrict} = comments | post | access | moderator
{
  "username":"someone",
  "email":"someone@gmail.com",
  "parola_admin":"parola12",
  "id": "6099a85c85afd46d920f4fbd"
}
*/


function grant(req, res, headers) {
    //console.log(req.url.split('?')[1].split('=')[1])
    let type_of_grant = req.url.split('?')[1].split('=')[1];
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async() => {
        try {
            data = JSON.parse(data);

            let user = await User.findOne({ username: data.username, email: data.email })
            let admin = await User.findOne({ _id: data.id, password: md5(data.parola_admin) })
                // console.log(admin)

            if (user === null) {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Nu exista un user cu acest username si email!' }, null, 4))
                res.end()
            } else if (admin === null) {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Nu exista un admin sau moderator cu acest id!' }, null, 4))
                res.end()
            } else if ((type_of_grant === "comments" || type_of_grant === "post") && admin.type === "normal") {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Nu aveti rolul potrivit!' }, null, 4))
                res.end()
            } else if (type_of_grant === "comments") {
                user.can_comment = "yes";
                let ok = await user.save()
                    // console.log(ok)
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Dreptul de a comenta a fost oferit!' }, null, 4))
                    res.end()
                } else {
                    // console.log("aICI")
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }

            } else if (type_of_grant === "post") {
                user.can_post = "yes";
                let ok = await user.save()
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Dreptul de a posta retete a fost oferit!' }, null, 4))
                    res.end()
                } else {
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }
            } else if (type_of_grant === "access") {
                user.access = "yes";
                let ok = await user.save()
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Userul poate accesa contul!' }, null, 4))
                    res.end()
                } else {
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }


            } else if (type_of_grant === "moderator") {
                user.type = "moderator";
                let ok = await user.save()
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Userul a fost promovat in rolul de moderator!' }, null, 4))
                    res.end()
                } else {
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
                    res.end()
                }
            } else {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Not found!' }, null, 4))
                res.end()
            }

        } catch (err) {
            console.log(error)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}


function restrict(req, res, headers) {
    //console.log(req.url.split('?')[1].split('=')[1])
    let type_of_restrict = req.url.split('?')[1].split('=')[1];
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', async() => {
        try {
            data = JSON.parse(data);

            let user = await User.findOne({ username: data.username, email: data.email })
            let admin = await User.findOne({ _id: data.id, password: md5(data.parola_admin) })
                // console.log(admin)

            if (user === null) {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Nu exista un user cu acest username si email!' }, null, 4))
                res.end()
            } else if (admin === null) {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Nu exista un admin sau moderator cu acest id!' }, null, 4))
                res.end()
            } else if ((type_of_restrict === "comments" || type_of_restrict === "post") && admin.type === "normal") {
                res.writeHead(401, headers);
                res.write(JSON.stringify({ 'message': 'Nu aveti rolul potrivit!' }, null, 4))
                res.end()
            } else if (type_of_restrict === "comments") {
                user.can_comment = "no";
                let ok = await user.save()
                    // console.log(ok)
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Dreptul de a comenta a fost restrictionat!' }, null, 4))
                    res.end()
                } else {
                    // console.log("aICI")
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare la baza de date!' }, null, 4))
                    res.end()
                }

            } else if (type_of_restrict === "post") {
                user.can_post = "no";
                let ok = await user.save()
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Dreptul de a posta retete a fost restrictionat!' }, null, 4))
                    res.end()
                } else {
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare la baza de date!' }, null, 4))
                    res.end()
                }
            } else if (type_of_restrict === "access") {
                user.access = "no";
                let ok = await user.save()
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Accesul userului a fost restrictionat !' }, null, 4))
                    res.end()
                } else {
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare la baza de date!' }, null, 4))
                    res.end()
                }


            } else if (type_of_restrict === "moderator") {
                user.type = "normal";
                let ok = await user.save()
                if (ok === user) {
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({ 'message': 'Userul nu mai este moderator!' }, null, 4))
                    res.end()
                } else {
                    res.writeHead(500, headers);
                    res.write(JSON.stringify({ 'message': 'Eroare la baza de date!' }, null, 4))
                    res.end()
                }
            } else {
                res.writeHead(404, headers);
                res.write(JSON.stringify({ 'message': 'Not found!' }, null, 4))
                res.end()
            }
        } catch (err) {
            console.log(error)
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
        }
    })
}



/// exemplu de functie pt PUT / POST / DELETE
/*

function change(req, res, headers) {
  //console.log(req.url.split('?')[1].split('=')[1])

  let data = '';

  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', async () => {
    try {
      data = JSON.parse(data);
      //aici lucram cu datele primite, le prelucram etc
      


      //trimitem raspunsul la server cu datele care trebuie
      res.writeHead(200, headers);
      res.write(JSON.stringify({ 'message': 'Ai modificat!' }, null, 4))
      res.end()

    }
    catch (err) {
      console.log(error)
      res.writeHead(500, headers);
      res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
      res.end()
    }
  })
}


*/


module.exports = { login, register, change, grant, restrict }
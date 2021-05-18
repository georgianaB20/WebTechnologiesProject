const mongoose = require('mongoose')
const User = require('../models/user')
const { db } = require('../utils/constants')
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
  req.on('end', async () => {
    try {
      data = JSON.parse(data);
      let user = await User.findOne({ "username": data.username }, '_id') //ca sa verificam daca userul exista
      let user2 = await User.findOne({ "username": data.username, "password": data.password }, '_id') //verificam daca
      //console.log(user2)
      if (user === null) {
        res.writeHead(500, headers);
        res.write(JSON.stringify({ 'message': 'Userul nu exista' }, null, 4))
        res.end()
      }
      else if (user2 === null) {
        res.writeHead(500, headers);
        res.write(JSON.stringify({ 'message': 'Username sau parola gresita.' }, null, 4))
        res.end()
      }
      else if (user2 !== null) {
        res.writeHead(200, headers)
        res.write(JSON.stringify(user2, null, 4))
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
  req.on('end', async () => {
    try {
      data = JSON.parse(data);
      //console.log(data);

      if (data.male !== undefined) {
        data.gender = 'M';
        delete data.male;
      }
      else if (data.female !== undefined) {
        data.gender = 'F';
        delete data.female;
      }
      else if (data.other !== undefined) {
        data.gender = 'Other';
        delete data.altceva;
      }

      //verificam daca emailul mai exista in BD
      let user_exists = await User.findOne({ 'email': data.email, 'username': data.username })
      if (user_exists !== null) {
        res.writeHead(400, headers);
        res.write(JSON.stringify({ 'message': 'Email-ul si numele de utilizator exista deja in baza de date.' }, null, 4))
        res.end();
      }
      else if (data.password !== data.confirm_password) {
        res.writeHead(422, headers);
        res.write(JSON.stringify({ 'message': 'Parolele sunt diferite.' }, null, 4))
        res.end();
      }
      else if (data.password.length < 8) {
        res.writeHead(422, headers);
        res.write(JSON.stringify({ 'message': 'Parola este prea scurta.' }, null, 4))
        res.end();
      }
      else {
        delete data.confirm_password;

        const new_user = new User(data);
        new_user.save(function (err) {
          if (err) {
            console.log(err);
            res.writeHead(500, headers);
            res.write(JSON.stringify({ 'message': 'Eroare interna!' }, null, 4))
            res.end()
          }
          else {
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
fson sample for testing /change?type_of_change=username
{
  "username":"user3",
  "password":"miaunel2",
  "id" : "60a2d0a2b24a5409bc9a5b73"
}
 */

function change(req, res, headers) {
  //console.log(req.url.split('?')[1].split('=')[1])

  let data = '';

  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', async () => {
    try {
      data = JSON.parse(data);
      console.log(req.url.split('?')[1].split('=')[1])
      let type_of_change = req.url.split('?')[1].split('=')[1]

      if (type_of_change === "username") {
        let check_pass = await User.findOne({ _id : data.id }, "password")
        let user = await User.findOne({ username : data.username }, "_id")

        if(data.username === undefined || data.password === undefined || data.id === undefined){
          res.writeHead(400, headers);
          res.write(JSON.stringify({ 'message': 'Ati trimis date incomplete!' }, null, 4))
          res.end()
        }
        else if (check_pass === null) {
          res.writeHead(401, headers);
          res.write(JSON.stringify({ 'message': 'Contul pe care incercati sa-l actualizati nu exista!' }, null, 4))
          res.end()
        }
        else if (check_pass.password !== data.password) {
          res.writeHead(401, headers);
          res.write(JSON.stringify({ 'message': 'Parola incorecta!' }, null, 4))
          res.end()
        }
        else if (user !== null) {
          res.writeHead(409, headers);
          res.write(JSON.stringify({ 'message': 'Username-ul exista deja in baza de date.' }, null, 4))
          res.end()
        }
        else {
          let update_user = await User.findByIdAndUpdate(data.id, { username: data.username })
          res.writeHead(200, headers);
          res.write(JSON.stringify({ 'message': 'Username actualizat!' }, null, 4))
          res.end()
        }

      }
      else if (type_of_change === "password") {

      }
      else if (type_of_change === "email") {

      }
      else if (type_of_change === "picture") {

      }
      else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({ 'message': 'Not found!' }, null, 4))
        res.end()
      }


      //trimitem raspunsul la server cu datele care trebuie
      // res.writeHead(200, headers);
      // res.write(JSON.stringify({ 'message': 'Ai modificat!' }, null, 4))
      // res.end()

    }
    catch (err) {
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


module.exports = { login, register, change }
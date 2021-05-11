const mongoose = require('mongoose')
const  user = require('../models/user')

mongoose.connect('mongodb+srv://TW:tw2021@cluster0.hgmw9.mongodb.net/whaf?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
console.log(mongoose.connection.readyState);

function login(req,res,headers){
  console.log(mongoose.connection.readyState);
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    res.writeHead(200, headers)
    res.write(data)
    res.end()
  })
}

function register(req,res,headers){
  //console.log(mongoose.connection.readyState);
  //console.log(user)
  let data='';

  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    data=JSON.parse(data);
    console.log(data);
    if (data.male!==undefined)
      {data.gender='M';
      delete data.male;
  }
    else if(data.female!==undefined)
      {data.gender='F';
      delete data.female;}
    else if (data.altceva!==undefined)
    {data.gender='Other';
  delete data.altceva;}
  // console.log(data);
   
  // console.log(new_user.username)
    //verificari parola
    if (data.password !== data.confirm_password){
      res.writeHead(422,headers);
      //res.write(JSON('{message:"Bad password"}'))
      res.end();
    }
    else{
      delete data.confirm_password;
      const new_user=new user(data);
      console.log(new_user.type)
      new_user.save(function (err){if (err)
      console.log(err);});
      console.log("from userController:"+data);
      user.findOne({'username' : data.username},
      'username password email',
       function(err,new_user2){if (err) return;
         console.log(new_user2.username,new_user2.password,new_user2.email)})
      res.writeHead(200, headers)
      res.write(data)
      res.end()
    }
  })
}

module.exports = { login, register }
const fs = require('fs')


function exempleAPI(req,res)
{
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify({ success: true, message: 'example ran successfully' }))
}
function getIndexHTML (req, res) {
  getHTML(req,res,'index.html')
}
   
function getIndexCSS (req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/css')
    data=fs.readFile('./public/css/index.css',null,function(error,data){
      if(error){
        console.log(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/css')
        res.write('Internal server error')
        res.end()
      }
      else{
        //console.log(data)
        res.write(data);
        getNavbarCSS(req,res);
      }
      //res.end()
    })
    
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
  }
}
function getNavbarCSS (req, res) {
  try {
    //res.statusCode = 200
    //res.setHeader('Content-Type', 'text/css')
    data=fs.readFile('../tw_proiect/public/css/nav.css',null,function(error,data){
      if(error){
        console.log(error)
        //res.statusCode = 500
        //res.setHeader('Content-Type', 'text/css')
        res.write('Internal server error')
        
      }
      else{
        //console.log(data)
        res.write(data)
      }
      res.end()
    })
    
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
  }
}
function getIndexJS (req, res) {
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/javascript')
    res.write(indexJS)
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
  }
}

function getStatics(req,res){
  var url = req.url.split('/')
  //console.log(url)

  // PRELUAM CSS-urile
  if(url[2]=='css' && url[3] !== undefined){ //mergem in folderul /public/css
    if(url[3].split('.')[1] === 'css') //fisierul cautat are extensia .css
    {

      try {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/css')
        data=fs.readFile('.'+req.url,null,function(error,data){
          if(error){
            console.log(error)
            res.statusCode = 500
            res.setHeader('Content-Type', 'text/css')
            res.write('Internal server error')
            //res.end()
          }
          else{
            //console.log(data)
            res.write(data);
            //getNavbarCSS(req,res);
          }
          res.end()
        })
        
      } catch (e) {
        console.log(e)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')
        res.write('Internal server error')
        res.end()
      }

    }
  }
  else if(url[2]=='images' && url[3] !== undefined){ //mergem in folderul /public/images
    //console.log(req.url)
    var type='image/' //setam valoarea corecta pentru Content-Type
    switch(url[3].split('.')[1]){
      case 'jpeg':
        type=type+'jpeg';
        break;
      case 'png':
        type=type+'png';
        break;
      case 'ico':
        type=type+'x-icon';
        break;
    }

    //incarcam fisierul
    try {
      res.statusCode = 200
      res.setHeader('Content-Type', type)
      data=fs.readFile('.'+req.url,null,function(error,data){
        if(error){
          console.log(error)
          res.statusCode = 500
          res.setHeader('Content-Type', type)
          res.write('Internal server error')
          //res.end()
        }
        else{
          //console.log(data)
          res.write(data);
        }
        res.end()
      })
      
    } catch (e) {
      console.log(e)
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/html')
      res.write('Internal server error')
      res.end()
    }
  }

}

function getHTML(req,res,file){
  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    data=fs.readFile('../tw_proiect/views/'+file,null,function(error,data){
      if(error){
        console.log(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')
        res.write('Internal server error')
        
      }
      else{
        //console.log(data)
        res.write(data)
      }
      res.end()
    })
    
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.write('Internal server error')
    res.end()
  }
}

module.exports = { getIndexHTML, getIndexCSS, getIndexJS, exempleAPI, getStatics, getHTML}


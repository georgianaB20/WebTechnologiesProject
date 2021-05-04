const fs = require('fs');
const indexController = require('./index');

function getRecipesHTML(req, res) {
    indexController.getHTML(req,res,'retetele_mele.html')
}
function getAddRecipeHTML(req,res){
    indexController.getHTML(req,res,'adauga_reteta.html')    
}

function getFavoriteHTML(req,res){
    indexController.getHTML(req,res,'favorite.html')        
}
  
module.exports = { getRecipesHTML,getAddRecipeHTML,getFavoriteHTML }
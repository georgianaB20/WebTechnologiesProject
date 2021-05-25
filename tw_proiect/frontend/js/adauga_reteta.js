import { handleFormSubmit } from './formToJson.js'

var recipeForm = document.getElementById("adauga_reteta_form");

// console.log(recipeForm)

recipeForm.addEventListener("submit", handleFormSubmit);
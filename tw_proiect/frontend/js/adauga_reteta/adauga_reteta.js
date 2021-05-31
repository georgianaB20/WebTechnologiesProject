import { handleFormSubmit } from './addRecipeFormHandler.js'

var recipeForm = document.getElementById("adauga_reteta_form");

recipeForm.addEventListener("submit", handleFormSubmit);
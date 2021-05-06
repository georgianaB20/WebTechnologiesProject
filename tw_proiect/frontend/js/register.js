import { handleFormSubmit } from './formToJson.js'

var registerForm = document.getElementById("register_form");
registerForm.addEventListener("submit", handleFormSubmit);
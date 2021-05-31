import { handleFormSubmit } from './registerFormHandler.js'

var registerForm = document.getElementById("register_form");
registerForm.addEventListener("submit", handleFormSubmit);
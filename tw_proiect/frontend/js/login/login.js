import { handleFormSubmit } from './loginFormHandler.js'

var loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", handleFormSubmit);
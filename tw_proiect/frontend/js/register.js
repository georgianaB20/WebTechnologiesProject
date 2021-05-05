import { handleFormSubmit } from './formToJson.js'

var loginForm = document.getElementById("register_form");
loginForm.addEventListener("submit", handleFormSubmit);
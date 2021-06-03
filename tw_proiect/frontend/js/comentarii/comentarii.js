import { handleFormSubmit } from './comentariiFormHandler.js'

var commentsForm = document.getElementById("comments_form");
commentsForm.addEventListener("submit", handleFormSubmit);
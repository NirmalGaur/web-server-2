// Client Side javScript which is going to run in the browser:

// Taking input from the form element in the home page:
const weatherForm = document.querySelector("form");
const searchElement = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

// messageOne.textContent = 'From js';

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault(); // The default behaviour of the form is to completely refresh the page on form submission. So we use preventDefault to stop this default behaviour and preserve the text written in the page
  const location = searchElement.value;

  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";

  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        messageOne.textContent = data.location;
        messageTwo.textContent = data.forecastData;
      }
      //We can see this in the console window localhost:3000 because index.hbs is linked with this js file
    });
  });
});

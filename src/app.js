// the applications we created untill now can only be accessible from the command line, it would be much better if a user can simply type a URL in the browser to pull-up and interact with our application.
// NPM library called as express, which makes it easy to create web-servers with node. These servers allow us to serve up all of the assests (html, css, client side jS) for our web application.
// using express we also able to serve up json data that allow us to get the location from the user, convert it into a forecast, and send the forecast back to the browser to have it rendered to the screen.
// instead of serving up a website, we can also serve up a http json based API (similar to mapbox API).

const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { get } = require("http");

// SHOW: console.log(__dirname); // gives the path of the current directory
// SHOW: console.log(__filename); // gives the path of the current file
// To get the path name for public folder in which our html file is located, we need to do the path manipulation of current directory. For that, we will use a core node module called 'path':
// SHOW: console.log(path.join(__dirname, '../public'));

// express library exposes a single function: express, and we call it CREATE A NEW EXPRESS application:
const app = express(); // we configure our server by using various methods provided on the express application itself

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public"); //path to the public directory

const viewsPath = path.join(__dirname, "../templates/views"); //path to the directory we want to be the views directory

// PARTIALS allows us to create a template which is part of a bigger webpage. With partials, we can create part of the webpage we end up reusing across multiple pages across the site (like headers and footers), without copying the markup b/w all the pages
const partialsPath = path.join(__dirname, "../templates/partials");

// We use $_template engine to render the dynamic web-pages using express. The template that we are gonna setup is called HANDLEBARS which allows the rendering the dynamic pages, it also allows us to create code that we can reuse (to share) across different pages.
// To integrate handlebars with express, we will use hbs npm library: 'npm i hbs@4.0.1'

// Once installed, all we need TO TELL EXPRESS WHICH TEMPLATE ENGINE WE INSTALL, we do that by using app.set
app.set("view engine", "hbs"); //first argument is the setting name, and second is setting value
// while working with express, it expects all the handlebars templates to live in a specific folder called views in the root of the project

//We can costumise views directory (that means we don't always have to name it 'view' or we can change its location to some nested directory):
app.set("views", viewsPath); //To tell express which directory we set as the views directory

//Now we can tell hbs in which directory our partials are:
hbs.registerPartials(partialsPath);

//We can check about various methods like app.set() by visiting expressjs.com >> API reference >> Application >> app.set()

// SETTING UP STATIC DIRECTORY: We can serve the public directory by calling app.use(), we pass in a call to express.static() which takes in the path to the folder we wanna serve up:
app.use(express.static(publicDirectoryPath));

//To actually serve up the template created in the views directory, we need to set up a route:
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App!",
    name: "Nirmal Gaur",
  }); //render allows us to render one of our view whose name is passed in res.render()
  // second arg to res.render is an object which contains all of the values we want the view to access
}); //So by calling res.render(), express goes of to get the specified view, it then convertes it into html

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Nirmal Gaur",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Some helpful text here...",
    title: "Help",
    name: "Nirmal Gaur",
  });
});

// For example, imagine we own the following domain:
// app.com  (home page- root route)
// app.com/help
// app.com/about

// To set up our server to send a response when someone tries to get something at a specific route, we use a method app.get which let us configure what the server should do when someone tries to get the resource at aspecific url:

/* SHOW: app.get('', (req, res) => {
  res.send('<h1>Home Page</h1>');
});  */
//first argument is the route- the partial url, and second is the function that describes what shouls done
// req is the object containing info about incoming request to the server, res contains the methods that allow us to costumise what we send to the requester
// res.send() allow us to send the response which is displayed on the browser window or terminal
// We either send back html designed to be rendered in the browser, or we are gonna send back json designed to consumed and used by code

/* SHOW: app.get('/help', (req, res) => {
  res.send({
    name: 'Nirmal',
    age: 25,
  });
});

app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
}); */
// Now to see the contents of pages we type 'localhost:3000/index.html', 'localhost:3000/help.html', 'localhost:3000/about.html'
// Note that 'static' means that the webpage loaded is a static not dynamic (remains the same always)

// What we need now is for the browser to be able to communicates with the server, passinga an address along. Then the server needs to convert that address into a forecast and pass it back to the browser so the browser can render the forecast data to the screen.
// To send the address from the browser, we will use the query string as a part of the url (provided at the end of url starting with ?) and then the server will read the query string value to get the address information.
// Information passed from the browser is now available inside the express route handler. Information about the query string lives in req.
app.get("/products", (req, res) => {
  // req.query contains all of the query strings information. If there is a query string 'search=game' then req.query.search will give us the value that is 'game'
  if (!req.query.search) {
    return res.send({
      //http request have a single request and single response, hence we return right here
      error: "You must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});

// To provide a json, we can send the object or an array. Now when we visit this page, we get a json response back (res), express detects the object and automically stringify the json for us
//Now to use the weather app in here, we have to first install 'npm i request@2.88.0
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided",
    });
  }
  // Using geocode and forecast from weather app:
  const geocode = require("./utility/geocode");
  const forecast = require("./utility/forecast");
  const location = req.query.address;
  geocode(location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error: error,
      });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error: error,
        });
      }
      res.send({
        location: location,
        latitude: latitude,
        longitude: longitude,
        forecastData: forecastData,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  //This is going to match any page that hasn't been matched and starts with /help/
  res.render("404", {
    message: "Help article not found.",
    title: "404",
    name: "Nirmal Gaur",
  });
});

// Setting up 404 PAGES:
app.get("*", (req, res) => {
  // To match everything else, express provides a wildcard character '*'
  res.render("404", {
    message: "Page not found.",
    title: "404",
    name: "Nirmal Gaur",
  });
});

// $_ MATCHING INCOMING REQUEST WITH THE CORRECT ROUTE HANDLER: When Express gets an incoming request, it starts to look for a match. Based on our application structure, first it will in the public folder, if not found, then in the root handler, then about handler, and then so on..
// If there is match, then it checks in the views directory for the file with same name as we provided in the first agrument of res.render(), and then render that hbs file accordingly

// Now to START UP THE SERVER, we use the method app.listen
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
}); // 3000 is a common development port, another optional argument is the callback function that can be passed when the server is up and running (process of starting-up a server is async)

// Now we can start-up the server by writing node src/app.js
// One thing to notice once the server is up is that we haven't been brought back to command prompt to run something else. That is bcz the web server is never gonna stop unless we stop it, as its job is to stay up and running/listening/ processing new incoming request
// We can shut down the web server using ctrl + c

// To visit in our home page browser, we type $_'localhost:3000'$_ .To view the help page we type: 'localhost:3000/help'
// To run the app, we use nodemon where we write -e (extension) followed by comma separated list of extensions that nodemon should watch: $_'nodemon src/app.js -e js,hbs'$_

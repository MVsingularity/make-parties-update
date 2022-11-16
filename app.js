// initialize express
const express = require('express')
const methodOverride = require('method-override')
const jwt = require('jsonwebtoken');

const app = express()

const cookieParser = require('cookie-parser');

const session = require('express-session')

app.use(methodOverride('_method'))

// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser');


// use "main" as our default layout
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
})); // FIX LATER
// Use handlebars to render
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));

const models = require('./db/models');


// mock array of projects
// var events = [
//   { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//   { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//   { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
// ]//
// //
app.use(cookieParser());

app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err)
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login')
      }
      req.user = user
      next(); // pass the execution off to whatever request the client intended
    })
  } else {
    next();
  }
});

app.use((req, res, next) => {
// if a valid JWT token is present
  if (req.user) {
  // Look up the user's record
    models.User.findByPk(req.user.id).then(currentUser => {
    // make the user object available in all controllers and templates
      res.locals.currentUser = currentUser;
      next()
    }).catch(err => {
      console.log(err)
    })
  } else {
    next();
  }
});
app.use(cookieParser("BETTERSECRET"));
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60) // 60 days

app.use(session({
  secret: "SECRET",
  cookie: {expires: expiryDate },
  // store: sessionStore,
  resave: true,
  saveUninitialized: true
}));
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;

  next();
});




Handlebars.registerHelper('isEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

require('./controllers/auth')(app, models);
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);

// Choose port to listen
const port = process.env.PORT || 3000;

//tell app to listen to PORT
app.listen(port, () => {
  console.log('App listening on port 3000!')
})

// initialize express
const express = require('express')
const app = express()

// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// use "main" as our default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home', { msg: 'Handlebars are Cool!'});
})

// Tell app to say hello world
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// mock array of projects
var events = [
  { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
]

// index
app.get('/', (req, res) => {
  res.render('events-index', {events: events });
})

// Choose port to listen
const port = process.env.PORT || 3000;

//tell app to listen to PORT
app.listen(port, () => {
  console.log('App listening on port 3000!')
})

const express = require("express")
const bodyParser = require("body-parser")
const cookieSession = require('cookie-session')
const app = express()
const PORT = process.env.PORT || 8000; // default port 8000

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

// set up the session store middleware
app.set('trust proxy', 1) // trust first proxy ???
app.use(cookieSession({
  name: 'session',
  keys: ['supersecret', 'supersecret2']
}))

app.set("view engine", "ejs")

const data = {
  users: [
    {username: 'monica', password: 'testing'}
  ]
}

app.get("/", (req, res) => {
  // req.session.favourite_fruit = 'apples';
  res.render("login", {fruit: req.session.favourite_fruit})
});

app.get("/favourite_fruit/:fruit", (req, res) => {
  req.session.favourite_fruit = req.params.fruit;
  res.redirect("/")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  res.send("Implement me!")
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.post("/signup", (req, res) => {
  res.send("Implement me!")
})

app.get("/logout", (req, res) => {
  res.redirect("/login")
})


app.get("/treasure", (req, res) => {
  // TODO: write code to only allow 
  // logged in users to see the page.
  const current_user = {}
  res.render("treasure", {current_user})
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


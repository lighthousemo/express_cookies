const express = require("express")
const Cookies = require('cookies')
const bodyParser = require("body-parser")
const KeyGrip = require("keygrip")
const keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256')
const app = express()
const PORT = process.env.PORT || 8000; // default port 8000

// Express middleware that parses cookies
app.use((req, res, next) => {
  req.cookies = new Cookies( req, res, { "keys": keys } )
  next()
})

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs")

const data = {
  users: [
    {username: 'monica', password: 'testing'}
  ]
}

app.get("/", (req, res) => {
  // if user logged in show treasure,
  // else show login
  const current_user = req.cookies.get("current_user")
  if(current_user) {
    res.redirect("/treasure")
  } else {
    res.render("login")
  }
});

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // check that it matches the database
  const user = data.users.find((user) => { return user.username === username })
  if(user.password === password) {
    // set a cookie to keep track of the user
    req.cookies.set("current_user", user.username, {signed: true})
    res.redirect("/treasure")
  } else {
    res.redirect("/login")
  }
})

app.get("/treasure", (req, res) => {
  const current_user = req.cookies.get("current_user")
  res.render("treasure", {current_user})
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.post("/signup", (req, res) => {
  data.users.push({username: req.body.username, password: req.body.password})
  console.log("All users are: ", data.users);
  res.redirect("/")
})

app.get("/logout", (req, res) => {
  req.cookies.set("current_user", "")
  res.redirect("/login")
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

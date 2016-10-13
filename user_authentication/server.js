const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const app = express()
const PORT = process.env.PORT || 8000; // default port 8000
const cookieParser = require("cookie-parser")

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

// set up cookie parser middleware.
//   access cookies with req.cookies or req.signedCookies if the cookie was signed.
//   set cookies with res.cooke("cookieName")
// cookieParser takes in the secret key as an argument. It uses this key to
// sign cookies.
app.use(cookieParser('super_secret_key'))

app.set("view engine", "ejs")

const data = {
  users: [
    {username: 'monica', password: 'testing'}
  ]
}

app.get("/", (req, res) => {
  // if user logged in show treasure,
  // else show login
  const current_user = req.signedCookies.current_user
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
  // Find user by username
  const user = data.users.find((user) => { return user.username === username })
  // check the password
  bcrypt.compare(password, user.password, (err, matched) => {
    if(matched) {
      // set a cookie to keep track of the user
      res.cookie("current_user", user.username, {signed: true})
      res.redirect("/treasure")
    } else {
      res.redirect("/login")
    }
  })
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      res.send("There was an error creating your account.")
      return
    }
    // add user to database
    data.users.push({username: req.body.username, password: hash})
    console.log("All users are: ", data.users);
    res.redirect("/")
  })
  // don't put code here
})

app.get("/logout", (req, res) => {
  res.cookie("current_user", "", {signed: true})
  res.redirect("/login")
})


app.get("/treasure", (req, res) => {
  const current_user = req.signedCookies.current_user
  res.render("treasure", {current_user})
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


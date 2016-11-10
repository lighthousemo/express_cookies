const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express()
const PORT = process.env.PORT || 8000; // default port 8000

// set up the session store middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard ninja cat',
  resave: false,
  saveUninitialized: true
}))

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs")

const data = {
  users: [
    {username: 'monica', password: "$2a$10$iKEbtLBDVa8xoH8YNoT0mu.IbL/A6utHPZbRb/s7PoZHRgZfZoBUq"}, // password is supersecret
  ]
}

app.get("/", (req, res) => {
  res.render("login")
});

app.post("/login", (req, res) => {
  console.log('data is ', data)
  const username = req.body.username;
  const password = req.body.password;

  // 1. Find the user with the given username
  // Upgrade: Write this step using Array.find. One line of code!
  var user;
  data.users.forEach((userObj) => {
    if(userObj.username === username) {
      user = userObj;
    }
  });

  if(user) {
    // Check that the password from the form matches the password
    // in the database.
    bcrypt.compare(password, user.password, function(err, passwordMatches){
      if(passwordMatches) {
        // Store the username in a protected session.
        req.session.username = user.username;
        res.redirect("/treasure");
      } else {
        // Password is incorrect. Login failed.
        res.redirect("/login");
      }
    });
  } else {
    // Username does not exist. Login failed.
    // res.send("Wrong username or password.")
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB. 
    const newUser = { username: username, password: hash };
    // Add the user to the list of registered users
    data.users.push(newUser);
    // TODO: log in the user automatically
    res.redirect("/login");
  });

})

app.get("/logout", (req, res) => {
  req.session.username = undefined;
  res.redirect("/login");
});

app.get("/treasure", (req, res) => {
  const currentUsername = req.session.username;
  if(currentUsername) {
    res.render("treasure", { username: currentUsername }); 
  } else {
    res.redirect("/login");
  } 
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


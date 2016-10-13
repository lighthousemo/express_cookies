const express = require("express")
const Cookies = require('cookies')
const KeyGrip = require("keygrip")
const keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256')
const app = express()
const PORT = process.env.PORT || 8000; // default port 8080

// Express middleware that parses cookies
app.use((req, res, next) => {
  req.cookies = new Cookies( req, res, { "keys": keys } )
  next();
})

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log(req.cookies.get("language"));
  const language = req.cookies.get("language")
  if(language === "English") {
    res.render("english")
  } else if(language === "French") {
    res.render("french")
  } else {
    res.render("choose_language")
  }
});

app.get("/choose_english", (req, res) => {
  req.cookies.set("language", "English");
  res.redirect("/");
})

app.get("/choose_french", (req, res) => {
  req.cookies.set("language", "French");
  res.redirect("/");
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


const express = require("express")
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT || 8000; // default port 8080

app.set("view engine", "ejs");

// Set up cookie parser middleware
app.use(cookieParser())

app.get("/", (req, res) => {
  console.log("Cookies are ", req.cookies)
  if(req.cookies.language === "english") {
    res.render("english")
  } else if(req.cookies.language === "french") {
    res.render("french")
  } else {
    res.render("choose_language")  
  }
});

app.get("/choose_english", (req, res) => {
  res.cookie('language', 'english');
  res.redirect("/");
})

app.get("/choose_french", (req, res) => {
  res.cookie('language', 'french');
  res.redirect("/");
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


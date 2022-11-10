//3.party module
const express = require('express');

// const ejs = require('ejs');


const app = express();

//Template engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static("public"));

//routes
app.get('/', (req, res) => {
  res.status(200).render('index', {
    page_name: "index"
  });
});

app.get('/about', (req, res) => {
  res.status(200).render('about', {
    page_name: "about"
  });
});



const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

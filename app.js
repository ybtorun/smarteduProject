//3.party module
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//own module
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute'); 

const app = express();

//connect db
mongoose.connect('mongodb://127.0.0.1:27017/smartedu-db').then(() => {
  console.log('Db connected succesfully');
});

//Template engine
app.set('view engine', 'ejs');


//Global Variable
global.userIN = null;


//Middlewares
app.use(express.static('public'));
app.use(express.json()) // for parsing application/json (req.body dekileri alabilmek için)
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/smartedu-db' }) //session bilgisini mongodb de tutma
}));

//Routes
app.use('*' , (req,res,next) => {
  userIN = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

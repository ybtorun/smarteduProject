const bcrypt = require('bcrypt');

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

//create user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // res.status(201).json({
    //   status: 'success',
    //   user,
    // });

    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //mongodb nin yeni sürümü await ile birlikte callback kullanımına hata veriyor.bu sebeple ayırdık
    const user = await User.findOne({ email }); //email:email
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {

          //user session
          req.session.userID = user._id; //req.session altında userID adında değişken tanımladık ve buna login olan user'ın id değerini atadık

          res.status(200).redirect('/users/dashboard');
          //console.log(email,req.session.userID);

      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//logout user
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

//dashboard page
exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id: req.session.userID}).populate('courses');//ilgili öğrencinin kurslarına gitmek için birleştirdik
  const categories = await Category.find(); //course oluşturuken category bilgisini de seçtirmek için çağırdık
  const courses = await Course.find({ user: req.session.userID }); //dashboard sayfasında her öğretmenin kendi kursunu görmesi

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses
  });
};

//get all user test amaçlı
// exports.getUsers = async (req, res) => {
//   try {
//     const user = await User.find();

//     res.status(201).json({
//       status: 'success',
//       user,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       error,
//     });
//   }
// };

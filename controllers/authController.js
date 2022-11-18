const User = require('../models/User');
const bcrypt = require('bcrypt');

//create user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      user,
    });
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
        if (same) {
          //user session
          req.session.userID = user._id; //req.session altında userID adında değişken tanımladık ve buna login olan user'ın id değerini atadık

          res.status(200).redirect('/users/dashboard');
          //console.log(email,req.session.userID);
        }
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
  const user = await User.findOne({_id: req.session.userID});
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user
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

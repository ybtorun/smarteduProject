const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

//create user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.flash('success', `${user.name} has been created succesfully`);
    res.status(201).redirect('/login');

    // res.status(201).json({
    //   status: 'success',
    //   user,
    // });


  } catch (error) {
    const errors = validationResult(req);
    // console.log(errors.array()[0].msg);

    for(i = 0; i < errors.array().length ; i++ ) 
    {
      req.flash('error',`${errors.array()[i].msg}`);//userRoute da bulunan arrayi referans alarak girilmeyen değerlerin mesajını yazdırıyoruz.
    }
    res.status(400).redirect('/register');
    // res.status(400).json({
    //   status: 'fail',
    //   error,
    // });
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
        } else {
          req.flash('error', 'Your password is not correct');
          res.status(400).redirect('/login');
        }
      });
    } else {
      req.flash('error', 'User is not exists!');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    req.flash('error',`Hata ${error}`);
    res.status(400).redirect('/login');

    // res.status(400).json({
    //   status: 'fail',
    //   error,
    // });
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
  const users = await User.find(); //admin kullanıcısının tüm kullanıcıları görebilmesi için

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users,
  });
};

//delete user
exports.deleteUser = async (req, res) => {
    try {

    //öğrencilerin kurslarından silinecek öğretmenin kursları çıkarmak için 
    const courses = await Course.find({ user: req.params.id });
    const students = await User.find({ role: 'student' });
    for (const student of students) {
      for (const course of courses) {
        if (student.courses.includes(course._id)) {
          student.courses.pull(course);
          await student.save();
        }
      }
    }

    const userdel = await User.findByIdAndRemove(req.params.id);  //{_id:req.params.id} //user ı  sildik  
    await Course.deleteMany({user: req.params.id });// {user:req.params.id} //user ın kurslarını sildik

      req.flash('error', `${userdel} has been deleted succesfully`);
      res.status(200).redirect('/users/dashboard');
  
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
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

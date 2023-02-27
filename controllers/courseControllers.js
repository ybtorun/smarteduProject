const Course = require('../models/Course');
const Category = require('../models/Category');
const { default: mongoose } = require('mongoose');
const User = require('../models/user');

//kurs oluşturma
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID
    });

    res.status(201).redirect('/courses')

    //frontend kısmı olmadığı zaman sadece backend kısmını aşağıdaki şekilde kodlarız.
    // res.status(201).json({
    //   status: 'success',
    //   course,
    // });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//tüm kursları getirme
exports.getAllCourses = async (req, res) => {
  try {
    const CategorySlug = req.query.categories; //requestteki category bilgisini alıyoruz
    const category = await Category.findOne({slug:CategorySlug}); //category bilgisinden mongo db deki hangi category olduğunu buluyoruz

    let filter = {}; //search için bunu önceden oluşturduk

    //course un kategorisi var mı?
    if(CategorySlug) {
      filter = {category: category._id}
    }

    const courses = await Course.find(filter).sort('-createdAt');
    const categories = await Category.find(); //category leri bulma

    res.status(200).render('courses', {
      courses,
      categories,//courses sayfasına category bilgilerini de gönderiyoruz
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//tekil kurs getirme
exports.getCourse = async (req, res) => {
  try {
    //***aşağıdakiler genel category leri getirmek için getAllCourses ile aynı
    const CategorySlug = req.query.categories; //requestteki category bilgisini alıyoruz
    const category = await Category.findOne({slug:CategorySlug}); //category bilgisinden mongo db deki hangi category olduğunu buluyoruz
    let filter = {}; //search için bunu önceden oluşturduk
    if(CategorySlug) {
      filter = {category: category._id}
    }
    const categories = await Category.find(); //category leri bulma
    //***
    const course = await Course.findOne({slug: req.params.slug}).populate('user'); //kursu veren öğretmen kullanıcısını gösterebilmek için populate yaptık böylelikle res.render içerisinde user ı göndermeye gerek kalmadı 

    const user = await User.findById(req.session.userID); //2. kere enroll olmaması için user bilgisini gönderdik.
    res.status(200).render('course', {
      course,
      categories,
      user,
      page_name: 'courses'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//enroll kurs
exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({_id:req.body.course_id});
    await user.save(); 

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//release kurs
exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({_id:req.body.course_id});
    await user.save(); 
  
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//postman dan json şeklinde tüm verileri çekme test amaçlı
exports.getAll = async ( req, res) => {
  try{
    const courses = await Course.find();
    res.status(200).json({
      status: 'success',
      courses,
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  };
  
} ;
//postman dan json şeklinde sadece 1 veriyi çekme test amaçlı
exports.getOne = async (req, res) => {
  try {
    const course = await Course.findOne({_id: req.params.id});

    res.status(200).json( {
      status: 'success',
      course,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


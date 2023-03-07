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

    req.flash('success', `${course.name} has been created succesfully`);
    res.status(201).redirect('/courses')

    //frontend kısmı olmadığı zaman sadece backend kısmını aşağıdaki şekilde kodlarız.
    // res.status(201).json({
    //   status: 'success',
    //   course,
    // });
  } catch (error) {
    req.flash('error','Something happened!');
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
    const query = req.query.search; //serach butonunda ki değeri alıyoruz.

    const category = await Category.findOne({slug:CategorySlug}); //category bilgisinden mongo db deki hangi category olduğunu buluyoruz

    let filter = {}; //search için bunu önceden oluşturduk

    //eğer category seçilmiş ise course ları bunun id sine göre filtrele
    if(CategorySlug) {
      filter = {category: category._id}
    }

    //eğer search e giriş yapılmışsa course ları isme göre filtrele
    if(query) {
      filter = {name: query}
    }

    //search ve category için bir girdi olmadığı durumda default değer ata
    if(!query && !CategorySlug) {
      filter.name = "",
      filter.category = null
    }

    const courses = await Course.find({
      $or: [
        {name: { $regex: '.*' + filter.name + '.*' , $options: 'i'}}, //search içi girilen veriye göre getir yada //options :i  büyük küçük harf aynı olur
        {category: filter.category} //filter da seçilen category göre getir
      ]

    }).sort('-createdAt').populate('user');// populate('user') ı kursu veren hocaları gösterebilmek için kullandık
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
    
    const course = await Course.findOne({slug: req.params.slug}).populate('user'); //kursu veren öğretmen kullanıcısını gösterebilmek için populate yaptık böylelikle res.render içerisinde user ı göndermeye gerek kalmadı 
    const user = await User.findById(req.session.userID); //2. kere enroll olmaması için user bilgisini gönderdik.
    const categories = await Category.find(); //genel category leri getirmek için 

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

//delete kurs
exports.deleteCourse = async (req, res) => {
  try {

    const course = await Course.findOneAndRemove({slug:req.params.slug});  
    req.flash('error', `${course.name} has been deleted succesfully`);
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


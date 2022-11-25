const Course = require('../models/Course');
const Category = require('../models/Category');

//kurs oluşturma
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).redirect('/courses')

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

    let filter = {}; //search için bunu oluşturduk

    //course un kategorisi var mı?
    if(CategorySlug) {
      filter = {category: category._id}
    }

    const courses = await Course.find(filter).sort('-createdAt');
    const categories = await Category.find(); //category leri bulma

    res.status(200).render('courses', {
      courses,
      categories,
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
    const course = await Course.findOne({slug: req.params.slug});

    res.status(200).render('course', {
      course,
      page_name: 'course',
    });
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


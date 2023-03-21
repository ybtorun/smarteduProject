const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    req.flash('success', `${category.name} has been created succesfully`);
    res.status(200).redirect('/users/dashboard');

    // res.status(201).json({
    //   status: 'success',
    //   category,
    // });
  } catch (error) {

    req.flash('error', `Category couldn't created Error: ${error}`);
    res.status(200).redirect('/users/dashboard');
    // res.status(400).json({
    //   status: 'fail',
    //   error,
    // });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    await Category.findByIdAndRemove(req.params.id);

    req.flash('error', `${category.name} has been deleted succesfully`);
    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
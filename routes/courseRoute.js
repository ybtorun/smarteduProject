const express = require('express');
const courseController = require('../controllers/courseControllers');

const router = express.Router();

router.route('/').post(courseController.createCourse); //http://localhost:3000/courses
router.route('/').get(courseController.getAllCourses);

// router.route('/all').get(courseController.getAll); //postman test amaçlı yapıldı
// router.route('/:id').get(courseController.getOne); //postman test amaçlı yapıldı

router.route('/:slug').get(courseController.getCourse);




module.exports = router;
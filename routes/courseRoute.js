const express = require('express');
const courseController = require('../controllers/courseControllers');
const roleMiddlewares = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddlewares(["teacher", "admin"]) ,courseController.createCourse); //http://localhost:3000/courses
router.route('/').get(courseController.getAllCourses);
router.route('/:slug').get(courseController.getCourse);
router.route('/:slug').delete(courseController.deleteCourse);
router.route('/enroll').post(courseController.enrollCourse);
router.route('/release').post(courseController.releaseCourse);


// router.route('/all').get(courseController.getAll); //postman test amaçlı yapıldı
// router.route('/:id').get(courseController.getOne); //postman test amaçlı yapıldı


module.exports = router;
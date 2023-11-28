const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require("../controllers/campground");
const {isLoggedIn , isAuthor,validateCampground,validateReview} = require("../middleware.js");
//multer is an middleware used to handle multiform data post like uploading files in form
const multer = require("multer");
const {storage} = require('../cloudinary');
const upload = multer({storage})


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground , catchAsync(campgrounds.createCampground))
    

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(validateReview,catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor ,upload.array('image'),validateCampground , catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor ,catchAsync(campgrounds.deleteCampground))




router.get('/:id/edit', isLoggedIn , isAuthor , catchAsync(campgrounds.renderEditForm))


module.exports = router;
const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const {validateReview , isLoggedIn ,isReviewAuthor} = require("../middleware");//if exported function are to be used taki it in curly brackets
//usually when we use router we get separate aparams with it so we need to include
//{mergeParams:true} while importing router


router.post('/',isLoggedIn ,validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;
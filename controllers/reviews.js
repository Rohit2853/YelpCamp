const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req,res)=>{
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id,{$pull :{reviews: reviewId}});//this will pull the review with the review id meand delte it
    await Review.findByIdAndDelete(reviewId);//this will trigge the middleware in campground.jsthe query middle ware
    req.flash('success','Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}
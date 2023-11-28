const mongoose = require("mongoose");
const Review = require("./review");
const { campgroundSchema } = require("../schemas");
const Schema = mongoose.Schema;

const opts = { toJSON: {virtuals :true}};
//since we wnated to create an virtual function on the imge schema we
// seaparated it from the main camoground schema
const ImageSchema = new Schema({
    url:String,
    filename:String
})
//it is virtual means it does not modify the database value but still looks like it
// this below function will be called when ever we call thumbnail
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200,h_200');
})

const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    geometry:{
        type:{
            type:String,
            enum :['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
//this opts is added in order to include virtuals in res.JSON()
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`;
})
//query middleware
//indOneAndDelete this param depends ont he type of delete function used  by the user
CampgroundSchema.post("findOneAndDelete",async function(data){
    if(data){
        await Review.deleteMany({
            _id:{
                $in: data.reviews//if will remove that reviews that are inside that data that was deleted
                //we need to remove that from database 
            }
        })
    }
})
module.exports = mongoose.model('Campground',CampgroundSchema);
//seeds folder has all the data it has nothing to do with app
//when we want o add data it will delete all previous data and add new one
const mongoose = require('mongoose');
const CampGround = require("../models/campground");
const cities = require("./cities");
const { places , descriptors } = require("./seedHelpers");

//connection with database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
then(()=>{
    console.log("MONGO CONNECTION OPEN!!!")
}).catch(err=>{
    console.log("Database Connected!!");
    console.log(err);
})

const sample = (array)=> array[Math.floor(Math.random()*array.length)];
const seedDb = async ()=>{
    await CampGround.deleteMany({});
    for(let i = 0 ; i < 300 ; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() *20)+10;
        const camp = new CampGround({
            //your user id
            author: "65603abdb7ee19da820a5cb0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude  
                ] 
            },    
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat temporibus cum, quod sunt molestias laudantium sint eum nemo tempore, vero in excepturi consectetur, porro vel tenetur natus repellat nostrum officiis.',
            price : price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dmyrpvrgp/image/upload/v1700918911/YelpCamp/gk3vunuv2dy96r7rvodp.jpg',
                  filename: 'YelpCamp/gk3vunuv2dy96r7rvodp'
                },
                {
                  url: 'https://res.cloudinary.com/dmyrpvrgp/image/upload/v1700918915/YelpCamp/zqloavj7r71pma473jzq.jpg',
                  filename: 'YelpCamp/zqloavj7r71pma473jzq'
                }
              ]
        })
        await camp.save();
    }
}
//since seedDb is async it will return promise once connection is made 
//and data is added then we dont need of connection
seedDb().then(()=>{
    mongoose.connection.close();
})
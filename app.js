if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('./models/user');
//this is been added to avoid get data from websites other tan specified
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
//this is the connection that we can make with the mongo atlas database
// const dbUrl = process.env.DB_URL;
const MongoDBStore = require("connect-mongo");
//routes
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes  = require("./routes/reviews");
const userRoutes = require('./routes/users');
//connection with database
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl)
.then(()=>{
    console.log("MONGO CONNECTION OPEN!!!")
}).catch(err=>{
    console.log("Database Connected!!");
    console.log(err);
})

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine' , 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

//this store has been created using mongo-coonect to store sessions on mongo instead of local browser
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    ttl: 24 * 60 * 60 
})

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})

const sessionConfig={
    store,
    name: '-yelp',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        // allows only https requests
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls,"https://cdn.jsdelivr.net/"],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmyrpvrgp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//passport library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
//this below to lines are of passport used to retrive and give info to session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this middleware handels flash messages
app.use((req,res,next)=>{
    // console.log(req.session);
    // console.log(req.query);
    //req.user is provided by passport which has user details but it is stored in session not accesible 
    //so we assign it to res.locals as thay are global
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Uisng all the routes
app.use('/',userRoutes);
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
    res.render('campgrounds/home');
})

app.all('*',(req,res,next)=>{
    //this made error is sent to the error handler at last
    next(new ExpressError('Page Not Found!!',404));
})
app.use((err,req,res,next)=>{
    const { status = 500 } = err;
    if(!err.message) err.message = 'Oh No, Someting Went Wrong!!'
    res.status(status).render('error',{err});
})
app.listen(3000,()=>{
    console.log("Serving on Port 3000!!");
})
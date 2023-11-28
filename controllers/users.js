const User = require("../models/user");

module.exports.renderRegister = (req,res)=>{
    res.render("users/register")
}

module.exports.register = async (req,res)=>{
    // res.send(req.body);
    //passport will be handling tha our username is unique
    try{
        const { email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash("success",'Welcome to Yelp Campground!');
            res.redirect('/campgrounds');
        })
    }catch(err){
        // console.log(err);
        req.flash('error',err.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login");
}

module.exports.Login = (req,res)=>{
    req.flash("success",'Welcome Back!!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
};


module.exports.Logout = (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        else{
            req.flash('success','GoodBye!!');
            return res.redirect("/campgrounds");
        }
    })
};
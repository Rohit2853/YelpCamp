const express = require("express");
const router = express.Router();
const User = require('../models/user');
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router.route('/register')
    .get(users.renderRegister)
    .post( catchAsync(users.register))

//we are using stroeReturnTO middleware it takes returnTo value from the session and use add it to localas as after
//login we need to redirect back to previous page 
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.Login)

router.get('/logout',users.Logout)

module.exports = router;
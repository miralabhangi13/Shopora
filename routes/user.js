const express = require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const userController=require("../controllers/user.js");
const {saveRedirectUrl,isLoggedIn}=require("../middleware");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(userController.newUser));
router.get("/login",(req,res)=>{
    res.render("users/login");
})
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/items");
    })
})
router.get("/user/address",(req,res)=>{
    res.render("users/address.ejs");
})
router.post("/user/address",isLoggedIn,wrapAsync(userController.saveAddress));
module.exports=router;
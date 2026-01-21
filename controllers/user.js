const User = require("../models/user.js");
const Address=require("../models/add.js");
module.exports.newUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user =new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Shopora! You are logged in");
            res.redirect("/items");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
module.exports.login=async(req,res)=>{
    req.flash("success","Glad to see you again!");
    let redirectUrl=res.locals.redirectUrl || ("/items");
    res.redirect(redirectUrl);
}
module.exports.saveAddress=async(req,res)=>{
    try{
        const address=new Address({
            ...req.body,
            user: req.user._id
        });
        await address.save();
        req.flash("success","Address saved successfully");
        const redirectUrl=req.session.redirectUrl|| "/items";
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);
    }catch(err){
        req.flash("error","Failed to save address");
        console.log(err);
        res.redirect("/user/address");
    }
}
const Address=require("./models/add.js");
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please login first to continue");
        return res.redirect("/login");
    }
    next();
}
module.exports.hasAddress=async (req,res,next)=>{
    const address=await Address.findOne({user: req.user._id});
    if(!address){
        req.session.redirectUrl=req.originalUrl;
        req.flash("success","view your cart by adding address");
        return res.redirect("/user/address");
    }
    next();
}
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express=require("express");
const app=express();
const passport=require("passport");
const LocalStrategy=require("passport-local");
const userRoute=require("./routes/user.js");
const engine=require("ejs-mate");
const path=require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose=require("mongoose");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const port=1313;
const items=require("./routes/items.js");
const User=require("./models/user.js");
const MD_URL=process.env.MD_URL;
app.engine("ejs",engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
main()
    .then(()=>{
        console.log("connect to db");
    }).catch((err)=>{
        console.log(err);
    })
    async function main(){
        await mongoose.connect(MD_URL);
    }
    const store=MongoStore.create({
    mongoUrl: MD_URL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
});

store.on("error",()=>{
    console.log("Error in Mongo session store",err);
});

const sessionOption={
    store,
   secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: Date.now()+7*24*60*60*1000,
        httpOnly: true
    },
}


app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

    app.get("/",(req,res)=>{
        res.redirect("/items")
    })
    app.use("/",userRoute);
    app.use("/items",items); 
    app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    
    // 1. Log the real error to your terminal so you can fix it
    console.log("💥 ERROR:", err); 

    // 2. Render a nice error page instead of sending [object Object]
    // Make sure you have an 'error.ejs' in your views folder!
    res.status(statusCode).render("error.ejs", { message, err });
});
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});
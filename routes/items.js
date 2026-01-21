const express = require("express");
const items = require("../models/item.js");
const router = express.Router();
const Cart = require("../models/cart.js");
const Order = require("../models/order.js");
const multer=require("multer");
const {storage}=require("../utils/cloudinary.js");
const upload=multer({ storage });
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn, hasAddress } = require("../middleware");
const Item = require("../models/item.js");
const item = require("../models/item.js");
router.get("/", async (req, res) => {
    const allitems = await items.find({});
    res.render("items/show.ejs", { allitems });
})
router.get("/new", isLoggedIn,(req, res) => {
    res.render("items/new.ejs");
})
router.post("/new",isLoggedIn,upload.single("itemimage"),async(req,res)=>{
    try{
        const {itemname,itemprice,category}=req.body;
        const item=new Item({
            itemname,
            itemprice,
            category,
            itemimage:req.file.path
        });
        await item.save();
        req.flash("success","Item added successfully");
        res.redirect("/items");
    }catch(err){
        console.log(err);
        req.flash("error","Failed to add item");
        res.redirect("/items/new");
    }
});
router.get("/:id/addtocart", isLoggedIn, (req, res) => {
    res.render("items/redirectToAddCart.ejs", {
        itemId: req.params.id
    });
});

router.post("/:id/addtocart", isLoggedIn, hasAddress, async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({
            user: userId,
            items: []
        });
    }
    if (!cart.items.includes(itemId)) {
        cart.items.push(itemId);
    }
    await cart.save();
    req.flash("success", "Item added to cart");
    res.redirect("/items/cart");
})
router.get("/cart", isLoggedIn, hasAddress, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
        .populate("items");
    res.render("items/cart.ejs", { cart });
});
router.post("/cart/:id/delete",async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedCart = await Cart.findOneAndUpdate(
      { user: req.user._id },          // cart belongs to logged-in user
      { $pull: { items: itemId } },    // remove only this item
      { new: true }
    );

    if (!updatedCart) {
      req.flash("error", "Item not deleted");
      return res.redirect("/items/cart");
    }

    req.flash("success", "Item removed from cart");
    res.redirect("/items/cart");
    }catch(err){
        console.log(err);
        req.flash("error","item not deleted");
        return res.redirect("/items/cart");
    }
});
router.post("/order/place", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items");
        if (!cart || cart.items.length == 0) {
            req.flash("error", "Your cart is empty");
            return res.redirect("/items/cart");
        }
        const totalPrice = cart.items.reduce(
            (sum, item) => sum + item.itemprice,
            0
        );
        const order = new Order({
            user: req.user._id,
            items: cart.items,
            total: totalPrice
        });
        await order.save();
        await Cart.findOneAndDelete({ user: req.user._id });
        req.flash("success", "Congratulations your order placed");
        res.render("items/order.ejs");
    } catch (err) {
        console.log(err);
        req.flash("error", "'Failed to place order");
        res.redirect("/items/cart");
    }
})
router.get("/search",async(req,res)=>{
    try{
        const {category}=req.query;
        const items=await Item.find({
            category:{ $regex: category, $options: "i" }
        });
        res.render("items/category.ejs",{allitems:items});
    }catch(err){
        console.log(err);
        req.flash("error","Search failed");
        res.redirect("/items");
    }
});
module.exports = router;
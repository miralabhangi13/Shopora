const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const cartSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    items:[
        {
            type:Schema.Types.ObjectId,
            ref:"Item"
        }
    ]
});
module.exports=mongoose.model("Cart",cartSchema);
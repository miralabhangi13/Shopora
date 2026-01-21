const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemname: {
        type: String,
        required: true
    },
    itemprice: {
        type: Number,
        required: true
    },
    itemimage: {
        type: String,
        required: true
    },
    category:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Item", itemSchema);

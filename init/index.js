const mongoose = require("mongoose");
const initData = require("./data.js");
const Item = require("../models/item.js");
const MD_URL="mongodb+srv://miralabhangi_db_user:HgfPhku3HfVahRlt@abhangimiral.2wxwkr1.mongodb.net/shopora";
main()
    .then(()=>{
        console.log("connect to db");
    }).catch((err)=>{
        console.log(err);
    })
    async function main(){
        await mongoose.connect(MD_URL);
    }
const initDB=async()=>{
    try{
        await Item.deleteMany({});
        console.log("Old data deleted");
        await Item.insertMany(initData.data);
        console.log("Data insereted");
        mongoose.connection.close();
    }catch(err){
        console.log(err);
    }
};
initDB();
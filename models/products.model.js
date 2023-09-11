const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:String,
    price:Number,
    quantity:String,
    category:String,
    subcategory:String,
    description:String,
    image:String
})

const  ProductModel=mongoose.model('furnitures',productSchema);
module.exports={ProductModel};
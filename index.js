const express=require('express');
const {connection}=require('./utils/db')
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const cors=require('cors');
const app=express();
app.use(express.json())
const {UserModel}=require("./models/user.models");
const {productRoutes}=require('./routes/product.route')

app.use(cors({
    origin:"*"
}))


app.get("/",(req,res)=>{
    res.send({msg:"Base Url here "});
})
app.get("/users",async(req,res)=>{
    let users=await UserModel.find();
    res.send(users);
})

app.post("/signup",async (req,res)=>{
    let {firstName,lastName,email,password}=req.body;
    bcrypt.hash(password,3,async function(err,hash){
        const user=new UserModel({
            firstName,
            lastName,
            email,
            password:hash
        });
        try{
            await user.save();
            res.send({message:"SignUp Successfully",status:true});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Something Went Wrong");
        }
    })
})


app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    const user=await UserModel.findOne({email});
    if(!user){
        res.send("Invalid Credentials Sign Up First");
    }
    else{
        const hashed_password=user.password;
        bcrypt.compare(password,hashed_password,function(err,result){
            if(result){
                    let token=jwt.sign({user_id:user._id},"Suresh")
                    res.send({message:"login Successfull", token:token, UserName:user.firstName,role:user.role})
            }
            else{
                res.send("Invalid Credentials Login Failed");
            }
        })

    }
})


app.use("/products",productRoutes);



app.listen(8081,async ()=>{
    try{
        await connection;
        console.log("Database BigBasketbackend connected through Atlas");
    }
    catch(err){
        console.log("Error while connecting DataBase");
        console.log(err);
    }
    console.log("App is listening on port 8081");
})
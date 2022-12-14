//jshint esversion:6
require('dotenv').config()

const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/usersDB");


app.get("/",(req,res)=>{
    res.render("home")
})

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

const secret=process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema);

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password

    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else
        res.render("secrets")
    })
    
})

app.post("/login",(req,res)=>{

    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){

        if(err){
            console.log(err);
        }
        else
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }
        }
    })

});



app.listen(process.env.PORT||3000,function(){

    console.log("Server started in port 3000");
});
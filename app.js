const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const https = require("https")
const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req,res)
{
    res.render("home");
});
app.get("/calculator",function(req,res){
  res.render("calculator")
})

// Environmental Impact = (Waste Quantity) x (Material Type Factor) x (Disposal Method Factor) x (Reuse Factor) x (Recycling Participation Factor)

// Parameters:

//     Waste Quantity: The amount of waste generated by the individual, measured in weight or volume.
//     Material Type Factor: A coefficient representing the environmental impact of the materials in the waste. Different materials (e.g., plastic, paper, organic) have varying degrees of impact.
//     Disposal Method Factor: A coefficient representing the environmental impact of the method used to dispose of the waste (e.g., landfill, recycling, composting).
//     Reuse Factor: A coefficient representing the individual's efforts to reuse items instead of disposing of them (e.g., using reusable containers, repairing items).
//     Recycling Participation Factor: A coefficient representing the individual's participation in recycling programs and the extent to which they recycle materials that are recyclable.

// These additional parameters allow individuals to consider their actions beyond just waste generation and disposal, such as reusing items and participating in recycling programs, when estimating their environmental impact.

app.listen(3000,function()
{
    console.log("Server Started on port on 3000");
});
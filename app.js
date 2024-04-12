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

app.post("/calculator",function(req,res){
  console.log(req.body);
  var alertscore=0;
  var Plastic=parseInt(req.body.Plastic);
  var Organic=parseInt(req.body.Organic);
  var Metallic=parseInt(req.body.Metallic);
  var glass=parseInt(req.body.glass);
  alertscore=alertscore+Plastic*2000;
  alertscore+=Organic*500;
  alertscore+=Metallic*1500;
  alertscore+=glass*1000;
  if(req.body.flexRadioDefault==='Landfill')
  alertscore*=2;
  else if(req.body.flexRadioDefault==='Composting')
  alertscore*=0.75;
  else if(req.body.flexRadioDefault==='Compaction')
  alertscore*=1;
  else if(req.body.flexRadioDefault==='Incineration')
  alertscore*=1.5;
  else if(req.body.flexRadioDefault==='Recycling')
  alertscore*=0.5;
  var rstring;
  var indiaavg=69622;
  if(indiaavg<alertscore)
  rstring="Uh oh! It looks like your waste output is higher than average."
  else if(alertscore>60000 && alertscore<indiaavg)
  rstring="Beware! You're almost at the average waste output. ";
  else if(alertscore<60000)
  rstring="Congratulations! Your efforts have paid off, your waste output is below average."
  

  var total= Plastic+Organic+glass+Metallic;
  var data = [Plastic,Organic,Metallic,glass,total];
  res.render("result",{alertscore:alertscore,rstring:rstring,data:data})


  
})


app.get("/result",function(req,res){
  res.render("result")
})
app.get("/report",function(req,res){
  res.render("report")
})
app.post("/report",function(req,res){
  console.log(req.body);
})
app.get("/manage",function(req,res){
  res.render("manage")
})


// google maps api
app.listen(3000,function()
{
    console.log("Server Started on port on 3000");
});
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const https = require("https")
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const { type } = require("os");
const router = express.Router();



app.use(express.static(path.join(__dirname, 'views')));


const app=express();
app.use(express.json());
var test=0;
var logged=" ";



mongoose.connect('mongodb+srv://amayvikramsinghece23:l3NH8WjxW380hj5D@q.ickxvwx.mongodb.net/?retryWrites=true&w=majority&appName=GH/userDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(express.static(path.join(__dirname, 'views')));

app.engine('ejs', require('ejs').renderFile);

app.set('view engine','ejs');


app.set('views', path.join(__dirname, 'views'));
app.use('/form', express.static(__dirname + '/index.html'));








app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('trust proxy', 1);
app.use(session({
  secret: 'stigma',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://inficos0520:yj9vtx3zJhYSgw6i@gh.zc3syn3.mongodb.net/?retryWrites=true&w=majority&appName=GH/userDB' })
}));


app.use(function(req, res, next) {
  if (!req.session) {
      return next(new Error('Oh no'))
  }
  next();
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB!");
});

module.exports = db;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
        required: [true, "Name is required"]
     },
    mobno: {
        type: Number,
        match: /^\d{10}$/, 
        required: [true, 'Mobile number is required'],
        unique: true,
    },
    username: {
        type: String,
        lowercase: true,
        required: [true, "Username is required"],
        index: true,
        unique: true
     },
     email: {
        type: String,
        lowercase: true,
        required: [true, "E-mail is required"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
     },
     gender: String,
     password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
     },
     confirmPassword: String,
     scores:[{alertscore:{ type:Number},date:{type:String,}}]
   
  
});
const User = mongoose.model("User", userSchema);


app.get("/signup",function(req,res)
{
    res.render("signup", { test:test,logged:logged});
});

app.get("/login",function(req,res)
{
    res.render("login", { test:test,logged:logged });
});
app.post("/logout", function(req, res) {

  req.session.destroy(function(err) {
      if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Internal Server Error" });
      }
      test=0;
      logged="";
      res.redirect("/login");
    });
});

if (test===0)
{app.post("/signup", async function (req, res) {
    const { name, mobno, username, email, gender,password, confirmPassword } = req.body;
      

    if (password !== confirmPassword) {

        return res.render("signup", { 
            error: "Passwords do not match",
            name,
            mobno,
            username,
            email,
            gender
        });
    }
    try {

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
          name,
          mobno,
          username,
          email,
          gender, 
          password: hashedPassword
      });
      await newUser.save();
  
      res.redirect("/login"); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create user" });
  }
});
}

var user;

app.post("/login", async function (req, res) {
  const { loginUsername, loginPassword } = req.body;

  try {

      user = await User.findOne({ username: loginUsername });

      console.log(user);
      console.log(loginUsername);
      if (!user) {
        console.log("User not found");
        return res.render("login", { test:test,logged:logged, error: "Invalid username or password" });
    }


    const isPasswordMatch = await bcrypt.compare(loginPassword, user.password);

    if (isPasswordMatch) {
      
        test=1;
        logged=loginUsername;
        console.log("User authenticated successfully");
        res.redirect("/");
    } else {

        console.log("Invalid password");
        return res.render("login", { test:test,logged:logged,error: "Invalid username or password" });
    }
} catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
});

if(test===1){
app.post("/profile", async function (req, res){

})
}
app.get("/profile", function(req, res){
  if(test===1)
  {res.render("profile", {test:test,logged:logged, user: user});}
  else{res.redirect("/signup")};
});




async function getStateFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      const state = data.address.state;
      return state;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
}

async function getCityFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      const city = data.address.city;
      return city;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
}




app.get("/",function(req,res)
{
    res.render("home",{test:test,logged:logged});
});
app.get("/calculator",function(req,res){
  res.render("calculator",{test:test,logged:logged})
})

app.post("/calculator",  function(req,res){
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
  let date = new Date().toLocaleDateString()

  var total= Plastic+Organic+glass+Metallic;
  var data = [Plastic,Organic,Metallic,glass,total];
  if(test==1)
  user.scores.push({alertscore:alertscore,date:date});
  
 




  res.render("result",{test:test,logged:logged,alertscore:alertscore,rstring:rstring,data:data,date:date})


  
})


app.get("/result",function(req,res){
  res.render("result",{test:test,logged:logged})
})
app.get("/report",function(req,res){
  res.render("report",{test:test,logged:logged})
})
app.post("/report", async function(req,res){
  console.log(req.body);

  var coor = req.body.coordinates;
  const [latitude, longitude] = coor.split(',');
  const lati = parseFloat(latitude);
  const longi = parseFloat(longitude);
  
  

 

  let date = new Date().toLocaleDateString();
 
  const city =   getCityFromCoordinates(lati, longi);
    const state =  getStateFromCoordinates(lati, longi);
   
  const coordinates= {latitude:lati,longitude:longi};

  console.log(state);
  console.log(city);
  
  // const obj= {city:city,state:state,name:req.body.name,coordinates:coordinates}

  // user.reports.push({city:city,state:state,name:req.body.name,coordinates:coordinates});
  
  
     
  



  
  res.render("reportres",{test:test,logged:logged,FormData:req.body,date:date,city:city,state:state,lati:lati,longi:longi})
  
})


app.get("/manage",function(req,res){
  res.render("manage",{test:test,logged:logged})
})

app.post("/manage",function(req,res){
  var coor1 = req.body.coordinates;
  const [latitude, longitude] = coor1.split(',');
  const lati = parseFloat(latitude);
  const longi = parseFloat(longitude);
  var str= "@"+latitude+","+longitude+","+"21z";
  var coords =[{coordinates:[lati,longi],name:'Your Location'}]

  // let obj1={name:req.body.name,email:req.body.email,address:req.body.address,date:req.body.date};
  // user.requests.push(obj1);
  const { getJson } = require("serpapi");
 
 
 
  var phones=[];
  var addresses=[];
  var titles=[]
  

getJson({

  
  engine: "google_maps",
  q: "recycle",
  ll: str,
  type: "search",
  api_key: "05489edf37e48dfcaf23b4c743b5c3a0ec976b0044945218d66d4970c570cc94"
}, (json) => {
  var localResults = json.local_results;
  
  let i=0,j=0;
   while(j<6 && i<localResults.length)
   {
     result=localResults[i];
     if(result.address && result.address!== "" && result.phone && result.phone!=="")
     {
     titles.push(result.title);
     phones.push(result.phone);
     addresses.push(result.address)
     let coord={coordinates:[result.gps_coordinates.latitude,result.gps_coordinates.longitude],name:result.title};
     
      coords.push(coord);
      j++;
     }
     i++;
   }
 
   
   res.render("manage2",{test:test,logged:logged,FormData2:req.body,lati:lati,longi:longi,coords:coords,phones:phones,addresses:addresses,titles:titles});
   
});




  


})
app.get("/manage2",function(req,res){
  res.render("manage2")
  
})






// google maps api
app.listen(3000,function()
{
    console.log("Server Started on port on 3000");
});
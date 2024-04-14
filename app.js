const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const https = require("https")



const app=express();


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
  let date = new Date().toLocaleDateString()

  var total= Plastic+Organic+glass+Metallic;
  var data = [Plastic,Organic,Metallic,glass,total];
  res.render("result",{alertscore:alertscore,rstring:rstring,data:data,date:date})


  
})


app.get("/result",function(req,res){
  res.render("result",)
})
app.get("/report",function(req,res){
  res.render("report")
})
app.post("/report", async function(req,res){
  console.log(req.body);

  var coor = req.body.coordinates;
  const [latitude, longitude] = coor.split(',');
  const lati = parseFloat(latitude);
  const longi = parseFloat(longitude);
  

 

  let date = new Date().toLocaleDateString();
 
  const city =  await getCityFromCoordinates(lati, longi);
    const state = await getStateFromCoordinates(lati, longi);
   

  console.log(state);
  console.log(city);
    
  
  
     
  



  
  res.render("reportres",{FormData:req.body,date:date,city:city,state:state,lati:lati,longi:longi})
  
})


app.get("/manage",function(req,res){
  res.render("manage")
})

app.post("/manage",function(req,res){
  var coor1 = req.body.coordinates;
  const [latitude, longitude] = coor1.split(',');
  const lati = parseFloat(latitude);
  const longi = parseFloat(longitude);
  var str= "@"+latitude+","+longitude+","+"21z";
  var coords =[{coordinates:[lati,longi],name:'Your Location'}]
  const { getJson } = require("serpapi");
 
  var phones=[];
  var addresses=[];
  var titles=[]
  

getJson({
  engine: "google_maps",
  q: "waste_management",
  ll: str,
  type: "search",
  num:"6",
  api_key: "2e0a7cceb50931d2412307452fd0199c1ae974c93c27cab241c85de555872a16"
}, (json) => {
  var localResults = json.local_results;
   for(let i=0;i<6;i++)
   {
     result=localResults[i];
     titles.push(result.title);
     phones.push(result.phone);
     addresses.push(result.address)
     let coord={coordinates:[result.gps_coordinates.latitude,result.gps_coordinates.longitude],name:result.title};
     
      coords.push(coord);
   }
 
   
   res.render("manage2",{FormData2:req.body,lati:lati,longi:longi,coords:coords,phones:phones,addresses:addresses,titles:titles});
   
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
//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const day=require(__dirname+"/date.js");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");



var hometodo=["Cook","Clean"];
var worklistheading="Work List Items";
var worktodo=[];

app.listen(3000,function(req,res){
  console.log("Server Running");
});

app.get('/',function(req,res){
  var pagedate=day.getDate();
  // var pagedate=day.getDay(); //will give Day on the top without date and month
  res.render("list",{listheading:pagedate,todoitems:hometodo});
});

app.post("/",function(req,res){
  console.log(req.body);
  var addeditem=req.body.newitem;
  if(req.body.list === "Work" )
  {
      worktodo.push(addeditem);
      res.redirect("/work");
  }
  else
  {  hometodo.push(addeditem);
    res.redirect("/");
  }
});

app.get('/work',function(req,res){
  res.render("list",{listheading:worklistheading,todoitems:worktodo});
});

app.post("/",function(req,res){
  var addeditem=req.body.newitem;
  worktodo.push(addeditem);
  res.redirect("/work");
});

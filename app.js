//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const day=require(__dirname+"/date.js");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser : true });

//Schema creation for default list
const itemSchema=new mongoose.Schema({
  name:String
});

// Schema for custom list
const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
});

//Mongoose model
const Item=mongoose.model("Item",itemSchema);
const List=mongoose.model("List",listSchema);


const item1=new Item({
  name:"Cook"
});
const item2=new Item({
  name:"Clean"
});

const defaultItems=[item1,item2];
const defaultForCustom=[];
var pagedate=day.getDate();

//var pagedate=day.getDay(); //will give Day on the top without date and month
app.listen(3000,function(req,res){
  console.log("Server Running");
});

app.get('/',function(req,res){
  Item.find(function(err,item){
    if(item.length===0) //if the list is emply default values are populated
    {
      Item.insertMany(defaultItems,function(err){

        if(err){
          console.log("Error occured");
        }
        else{
          console.log("Default list populated");
        }

        res.redirect('/');
      });
    }

    else{
    res.render("list",{listheading:pagedate,todoitems:item});
    }

  });
});

app.post("/",function(req,res){
  var addeditem=req.body.newitem;
  const listName=req.body.list;
  const newItem= new Item({
    name:addeditem
  });
  console.log(pagedate);
  if(listName===(pagedate.substr(0,pagedate.indexOf(' '))))
    {
    newItem.save();
      res.redirect("/");
    }
    else{
      List.findOne({name:listName},function(err,foundList)
      {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+listName);
        });
    }
});



app.post("/delete",function(req,res){
  const checkeitemID=req.body.checkbox;
  const listName=req.body.hiddenListName;

  if(listName===(pagedate.substr(0,pagedate.indexOf(' '))))
    {
      Item.findByIdAndRemove(checkeitemID,function(err){
        if(err){
          console.log("Error occured while removing element");
        }else{
          res.redirect('/');
          console.log("Successfully deleted item");
        }
        });
    }
    else{
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkeitemID}}},function(err,foundList){
        if(!err)
        {
          res.redirect("/"+listName);
        }
      });

    }
});

// route for custom list
app.get('/:listName',function(req,res){
  const customListName=req.params.listName;
  List.findOne({name:customListName},function(err,foundList){
    if(!foundList)
    {
      const list=new List({
        name:customListName,
        items:defaultForCustom
      });
      list.save();
      res.redirect("/"+customListName);
    }else{
      res.render("list",{listheading:customListName,todoitems:foundList.items});
    }
  });




});

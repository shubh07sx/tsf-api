var express =require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodoverride = require("method-override");
var expresssanitizer= require("express-sanitizer");


//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended: true}));
app.use(expresssanitizer());
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodoverride("_method"));
//MONGOOSE MODEL /CONFIG SCHEMA 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date , default: Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);
//Blog.create({
  //  title: "testblog",
    //image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=343c64df1b43f50769656d03c2b9f523&auto=format&fit=crop&w=500&q=60",
    //body:   "this is a blog post"
    //});
//RESTFUL ROUTES 
app.get("/",function(req,res){
   res.redirect("/blogs"); 
});
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});
app.post("/blogs",function(req,res){
   //create new blog 
   req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err, newblog){
      if(err){
          res.render("new");
      } 
      else{
            //redirect to the  index
            res.redirect("/blogs");
      }
   });
});
app.get("/blogs/:id",function(req,res){
        //we need to render the info about the specific blog post 
        Blog.findById(req.params.id,function(err,blog){
            if(err){
                res.redirect("/blogs");
            }
            else{
               res.render("show",{blog: blog}); 
            }        
        });
});
//EDIT ROUTE 
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog: foundblog}); 
        }
    });
   
});
//update route 
//here we are using the findByIdAndUpdate method to update the blog 
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
//delete route 
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/blogs");
      }
      else{
          res.redirect("/blogs");
      }
   });
});
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       }
       else{
            res.render("index",{blogs: blogs}); 
       }
   });  
});

// we need a port to run the application 
app.listen(3000,function(){
  console.log("SERVER STARTED!!!");
});
const express      = require('express'),
app                = express(),
port               = process.env.PORT,
ip                 = process.env.IP,
bodyParser         = require('body-parser'),
methodOverride     = require('method-override'),
mongoose           = require('mongoose'),
Schema             = mongoose.Schema;
          

//use the native promises librabry
mongoose.Promises = global.Promises;


/****************************************
 * DB CONNECT & APP CONFIGURATIONS
 * ***************************************/
//connect to MongoDB
var db = "mongodb://localhost/blogapp_db";
mongoose.connect(db, {useMongoClient : true});
 
//set view engine template        
app.set("view engine", 'ejs');

//To serve static files use this middleware function in Express.
app.use(express.static("public"));

//set up the environment to make use of bodyparser
app.use(bodyParser.urlencoded({extended:true}));

//set what methodoverride should look for in URL
app.use(methodOverride("_METHOD"));

/****************************************
 * MONGOOSE SCHEMA / MODEL CONFIGURATIONS
 * ***************************************/
//Define a Schema
var blogSchema = Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})



//Map schema to model
var Blog = mongoose.model("Blog",blogSchema);


//Create a temp entry to test DB
// Blog.create({
//     title:"My Test Blog",
//     image:"http://www.analystconsult.com/wp-content/uploads/2015/07/Blog.png",
//     body:"Bacon ipsum dolor amet hamburger doner chuck, flank biltong cupim bresaola kielbasa brisket ball tip fatback. Corned beef tongue kielbasa prosciutto capicola brisket bacon biltong, filet mignon bresaola boudin cupim beef ribs andouille."
// })


/*############################################
            Define RESTful Routes
#############################################*/
//INDEX ROUTE
app.get('/',function(req , res){
    res.redirect("/blogs");
})

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});
          


//NEW ROUTE
app.get('/blogs/new',(req, res)=>{
    res.render("new");
});


//CREATE ROUTE
app.post('/blogs',function(req ,res){
    var newpost = req.body.blog;
    
    Blog.create(newpost,function(err,newcontent){
        if(err){
            res.render("new");
        } else{
            res.redirect('/blogs');
        }
    })
})

//SHOW ROUTE
app.get('/blogs/:id',function(req,res){
   var id = req.params.id;
   
   Blog.findById(id,function(err,blogdata){
       if(err){
           console.log(err);
       } else {
           res.render("show",{blogdata:blogdata})
       }
   });
})

//EDIT ROUTE

app.get('/blogs/:id/edit',(req,res) =>{
   var id = req.params.id;
   Blog.findById(id,(err,foundblog)=>{
       if(err){
           res.redirect('/blogs');
       } else {
           res.render("edit",{blogdata:foundblog});
       }
   });
});

//UPDATE ROUTE
app.put('/blogs/:id',(req,res) => {
    var id = req.params.id;
    var updatedcontent = req.body.blog;
    Blog.findByIdAndUpdate(id,updatedcontent,(err,updatedblog)=>{
        if(err){
            res.redirect('/');
        } else {
            res.redirect('/blogs/'+id);
        }
    });
});

app.listen(port,ip,() => {
    console.log(`The Server is started on port ${port}`);
})
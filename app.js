const     express      = require('express'),
          app          = express(),
          port         = process.env.PORT,
          ip           = process.env.IP,
          bodyParser   = require('body-parser'),
          mongoose     = require('mongoose'),
          Schema       = mongoose.Schema;
          
//set view engine template        
app.set("view engine", 'ejs');

//use the native promises librabry
mongoose.Promises = global.Promises;

//connect to MongoDB
var db = "mongodb://localhost/blogapp_db";
mongoose.connect(db, {useMongoClient : true});

//To serve static files use this middleware function in Express.
app.use(express.static("public"));

//set up the environment to make use of bodyparser
app.use(bodyParser.urlencoded({extended:true}));

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
app.get('/blogs/new',function(req, res){
    res.render("new");
});


//CREATE ROUTE
app.post('/blogs',function(req ,res){
    var title = req.body[title];
    var image = req.body[image];
    var body = req.body[body];
    var newpost = req.body.blog;
    
    Blog.create(newpost,function(err,newcontent){
        if(err){
            res.render("new");
        } else{
            res.redirect('/blogs');
            console.log(newcontent);
        }
    })
})

//SHOW ROUTE
app.get('/blogs/:id',function(req,res){
   var id = req.params.id;
   
   Blog.findById(id,function(err,blogdata){
       if(err){
           console.log(err);
           console.log("blog not found");
       } else {
           res.render("show",{blogdata:blogdata})
       }
   });
})


app.listen(port,ip,function(){
    console.log("the server is STARTED!");
})
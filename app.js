var express = require("express"),
  bodyparser = require("body-parser"),
  expressSanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  app = express();

//mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb://naga:naga123@ds145043.mlab.com:45043/blogger_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  date: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//Blog.create({
//  title : "This is First Blog",
//image : "https://images.thrillophilia.com/image/upload/s--RfHu--Sq--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/113/000/original/1521614469_maxresdefault.jpg.jpg?15216",
//body : "I have enjoyed my time in this place"
//});

//Restful Routes
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
  //create blog
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log("================");
  console.log(req.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      //redirect to index
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
  //destroy the blog
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
  //redirect to somewhere
});

const port = process.env.PORT || 5000;
app.listen(port, function(req, res) {
  console.log(`Server is running in the port ${port}`);
});

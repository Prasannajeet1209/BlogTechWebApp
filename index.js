const express = require("express");
const blogPostArray = require('./data');
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();
// mongoose.connect();
// 
const MONGO_URLDB = process.env.MONGO_URL;

mongoose.connect(MONGO_URLDB)
    .then(() => {
        console.log("DB connected Sucessfully");
    }).catch((err) => {
        console.log("Error", err);
    });

const blogSchema = new mongoose.Schema({
    imageURL: String,
    title: String,
    description: String

});

const Blog = new mongoose.model("blog", blogSchema);

app.get('/', (req, res) => {

    Blog.find({})
    .then((arr) => {
        res.render("index", { blogPostArray:arr });
    }).catch((err) => {
        console.log("cannot find blog");
        res.render("404")
    });


   // res.render("index", { blogPostArray:blogPostArray });

})


app.get('/contact', (req, res) => {
    res.render("contact");
});

app.get('/compose.html', (req, res) => {
    res.render("compose");
})

app.post("/compose", (req, res) => {
    const title = req.body.title
    const image = req.body.imageUrl
    const description = req.body.description
    const NewId = blogPostArray.length + 1

    const newBlog = new Blog({
        imageURL: image,
        title: title,
        description: description
    })

    newBlog.save()
    .then(() => {
        console.log("Blog Posted Successfully ");
    }).catch((err) => {
        console.log("Error", err);
    });
    res.redirect("/");
})



app.get('/post/:id', (req, res) => {
    // console.log(req.params.id);
    const id = req.params.id;
    let imageURL = "";
    let title = "";
    let description = "";
    blogPostArray.forEach(post => {
        if (post._id == id) {
            title = post.title;
            imageURL = post.imageURL;
            description = post.description;
        }
    })

    const post = {
        title: title,
        imageURL: imageURL,
        description: description,

    }

    res.render("post", { post: post });
})

app.get('/about', (req, res) => {
    res.render("about");
})
const port=5000 || process.env.PORT
app.listen(port, () => {
    console.log("Server is listening at port 5000");
});

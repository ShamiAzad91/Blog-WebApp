require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//initialize express app
const app = express();

// Connect to the database
connectDB();


//Middleware, routes, etc.
app.use(cors({
    origin: 'http://localhost:5173', // or your frontend URL
    credentials: true,
    exposedHeaders: ['Authorization', 'x-refresh-token'],
  }));
  
app.use(cookieParser());
app.use(express.json());

//MyRoutes
const authRoutes = require("./Routes/Auth");
const  blogRoutes = require("./Routes/Blog");
const imageUploadRoutes = require("./Routes/imageUploadRoutes");
const userRoutes = require("./Routes/User");


//my routes
app.get("/",(req,res)=>{
    res.json({name:'shami Api is working'})
});

app.use("/auth",authRoutes);
app.use("/blog",blogRoutes);
app.use("/image",imageUploadRoutes);
app.use("/user",userRoutes);



//categories blog
app.get('/blogcategories', async (req, res) => {
    const blogCategories = [
        "Technology Trends",
        "Health and Wellness",
        "Travel Destinations",
        "Food and Cooking",
        "Personal Finance",
        "Career Development",
        "Parenting Tips",
        "Self-Improvement",
        "Home Decor and DIY",
        "Book Reviews",
        "Environmental Sustainability",
        "Fitness and Exercise",
        "Movie and TV Show Reviews",
        "Entrepreneurship",
        "Mental Health",
        "Fashion and Style",
        "Hobby and Crafts",
        "Pet Care",
        "Education and Learning",
        "Sports and Recreation"
    ];
    res.json(
        {
            message: 'Categories fetched successfully',
            categories: blogCategories
        }
    )
})


//start the server
const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is up and running at port  ${port}`);
    
})

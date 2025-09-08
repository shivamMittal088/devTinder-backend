const express = require('express');

const app = express();

app.get("/about",(req,res)=>{
    res.send("About page");
})

app.post("/about",(req,res)=>{
    res.send("This is a post request about page");
})

app.use("/" , (req,res)=>{
    res.send("Hello world");
})



app.listen(7777,(()=>{
    console.log('Server is running on port 7777');
}))
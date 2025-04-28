const express = require('express');

const app = express();


app.get("/", (req,res)=>{
    res.json({"msg" : "Hello from server (using test branch)"});
});

app.listen(3000, ()=>{
    console.log("server running at port 3000");
})
var express = require('express');
var path =require('path');
var app = express();
var fs = require('fs');

app.use(express.urlencoded());
app.get('/',function(req,res){
    fs.readFile('z.html',function(err,data){
        if(err){
            console.log(err);
        }
        else
        {
            console.log("server started");
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);
        }
    });
});
app.get('/',function(req,res){
    res.render('home');
    res.end();
});
app.post('/send',function(req,res){
    var user=req.body;
    res.send(JSON.stringify(user));
});
app.listen(1000,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log(__dirname);
    }
});

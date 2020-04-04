const express=require('express');
const upload=require('express-fileupload');
var path=require('path');
const app=express();
app.use(upload());
const {Pool,Client}=require('pg');
const pool=new Pool({
    user:"postgres",
    host:"localhost",
    database:"postgres",
    password:"12345",
    port:8000
});
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'/s.html'));

});

app.post('/upload',function(req,res){
    if(req.files){
        var file=req.files.file;
        var filename=file.name;
    
        filename=eval("'"+vn+".mp4'")
        file.mv('./upload/'+filename,function(err){
          
          if(err){  res.send("error");}
          else{
              res.send("done");
          } 
        }); 
    }
});
app.listen(1000,function(err){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("server");
    }
});
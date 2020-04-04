var express = require('express');
var path =require('path');
var http=require('https')
var app = express(http);
var bodyparser =require('body-parser');
var cors = require('cors');
var upload=require('express-fileupload');
app.use(cors({extended:true}));
app.use(bodyparser({extended:true}));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(upload());
app.use(express.urlencoded({extended:true}));
const {Pool,Client}=require('pg');
const pool=new Pool({
    user:"postgres",
    host:"localhost",
    database:"postgres",
    password:"12345",
    port:8000
});
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

app.use(express.static(path.join(__dirname,'upload')))
//signin
var e=0;
app.get('/',function(req,res){
    
    return res.render('signup');
    
});
app.post('/signup',function(req,res){
    let s=req.body;
    let n=s.username; 
    let name="'"+s.username+"'";
    let email="'"+s.email+"'";
 
    let pass="'"+s.pass+"'";
  
    pool.query(`insert into acc(uname,pass,email) values(${name},${pass},${email})`,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            console.log(result.rows);
        }
    }); 
   return res.render('signup')

});
//login
app.get('/login',function(req,res){
    var o=0;
    if(req.session.name){
        return res.render('login2',{n:o,name:req.session.name,id:req.session.i});
    }
    var a=0;
    res.render('login',{a:a});
});
app.post('/login',function(req,res){
    var s=req.body;
    var email=s.email;
    var pass=s.pass;
    pool.query("select * from acc ",function(err,result){
        if(err){
            let a=1;
            console.log(err);
           return res.render('login',{a:a});
        }
        else{
            q=result.rows;
            var o=0;
            for(var i in q)
            {
                console.log(q[i].email,email);
             if(q[i].email.trim()==email.trim()&&q[i].pass.trim()==pass.trim()){
                   
                   req.session.name=q[i].uname.trim();
                   req.session.i=q[i].id;
                   console.log(req.session)
                    return res.render('login2',{n:o,name:req.session.name,id:req.session.i});
                 console.log("working")
                }  
            }
            let a=1;
           return res.render('login',{a:a});
        }
    });
});

app.get('/login2',function(req,res){
    res.render('login2',{name:req.session.name})
})

//upload
var up=[],q=[]
app.get('/upload',function(req,res){
     pool.query(`select * from video`,function(err,result){
        if(!err){
            up=[]
            q=[]
            console.log(result)
         for(var i in result.rows)
            {
                 q.push(result.rows[i].uname.trim());
                up.push(result.rows[i].name.trim())
            }
        }
    })
    return res.render('up',{o:up,id:q});
});


app.post('/upload',function(req,res){
    if(req.files){
        var file=req.files.file;
        var filename=file.name;
     
        file.mv('./upload/'+filename,function(err){
         var z="'"+filename+"'";
          if(err){  console.log("error");}
          else{
            pool.query(`insert into video values(${z},${req.session.i},'${req.session.name}')`,function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                  console.log(result.rows);
                }
            });
             return res.render('login2',{name:req.session.name});
          } 
        }); 
    }
});


app.listen(1000, function(err){
    if(!err){
        console.log("servver started");
    }
});


//logout
app.get('/logout',function(req,res){
    req.session.destroy();
    return res.render('login',{a:0})//if logout then l=1
})


//setting
app.get('/setting',function(req,res){
    return res.render('s',{d:0})
})

app.post('/delete',function(req,res){
        pool.query(`delete from acc where id=${req.session.i}`,function(err,result){
            if(!err){
                console.log("deleted");
             }
        })
        pool.query(`delete from video where vid=${req.session.i}`,function(err,result){
            if(!err){
                console.log("deleted");
             }
        })
        req.session.destroy();
        res.render('deleted')
})

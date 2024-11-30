const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config
const app = express();
app.use(express.json());
const posts = [
    {name:'sanjay',title:'hiii'
    }
];
const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).json({error:'token is required'});
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=> {
        if(err){
            return res.status(401).json({error:'token is not valid'})
        }
        req.user = user;
        next();
    });
};
app.post('/send',(req,res)=>{
    const username = req.body.username;
    if(!username){
        return res.status(400).json({error:'username is reuired'});
    }
    const user = {name:username};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN);
    res.join({accessToken});
});
app.use(authenticateToken);
app.get('/get',(req,res)=>{
    const userPosts=posts.filter(post=>post.name===req.user.name);
    res.join(userPosts)
});
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


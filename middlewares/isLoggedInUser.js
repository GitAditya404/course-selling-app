const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

async function isLoggdIn(req,res,next){
    let token = req.header.token;
    let data = jwt.verify(req.cookies.token,process.env.JWT_USER_SECRET)
    req.user = data;
    try{
        const user = await userModel.findOne({_id:req.user}).select('-password');
        if(!user)
            return res.status(400).send('User no longer exists')
        req.user = user;
        next()
    }
    catch(err){
        return res.send('Something went wrong')
    }

}
const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')

async function isLoggdInAdmin(req,res,next){
    let token = req.header.token;
    let data = jwt.verify(req.cookies.token,process.env.JWT_ADMIN_SECRET)
    try{
        if(!data)
            res.status(400).send('you are not logged in')
        else{
            const admin = await adminModel.findOne({_id:data._id}).select('-password');
            if(!admin)
                return res.status(400).send('User no longer exists')
            req.admin = admin;
            next()
        }

    }
    catch(err){
        return res.send('Something went wrong')
    }

}

module.exports = isLoggdInAdmin
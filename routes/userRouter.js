const express = require('express')
const zod = require('zod')
const userRouter = express.Router()
// const {Router} = require('express')  // same as above
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isLoggdInUser = require('../middlewares/isLoggedInUser')
const purchaseModel = require('../models/purchaseModel')

userRouter.post('/signup',async (req,res) => {
    const bodySchema = zod.object({
            email : zod.string().email(),
            firstName : zod.string().min(3).max(100),
            lastName : zod.string().min(3).max(100),
            password : zod.string()
                .min(5, "Password must be at least 5 characters")
                .max(10, "Password must be maxm 10 characters")
                .regex(/[a-z]/, "Must contain at least one lowercase letter")
                .regex(/[A-Z]/, "Must contain at least one uppercase letter")
                .regex(/[0-9]/, "Must contain at least one number")
                .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")
            });
        
        const result = bodySchema.safeParse(req.body)
        if(!result.success) {
            return res.json({
                msg: `${result.error.issues[0].message}`
            })
        }
    
        const {email, firstName, lastName, password} = result.data;
        
        try{
                let user = await userModel.findOne({email:email})
                if(user)
                    return res.status(400).send("User already exists")
                
                let saltRounds = 5;
                        bcrypt.hash(password, saltRounds,async function(err, hash) {
                            if (err) {  // try-catch will not caught bcrypt err b/c it uses a callback fn
                                return res.status(500).json({ msg: "Error hashing password" });
                            }
                            await userModel.create({
                                email, 
                                password: hash,
                                firstName, lastName
                            })
                            return res.status(201).send("User created Successfuly")
                        });
            }
        
            catch(err){
                return res.status(500).json({
                    msg: "Internal Server Error"
                })
            }
})

userRouter.post('/login',async (req,res) => {
    const bodySchema = zod.object({
            email : zod.string().email(),
            password : zod.string()
        })
    
        const result = bodySchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                msg: `${result.error.issues[0].message}`
            })
        }
    
        let {password, email}  = result.data;
        try{
            let user = await userModel.findOne({email})
                if(!user)
                    return res.status(404).send("Account not found")
                const hash = user.password;
                bcrypt.compare(password, hash, function(err, result) {

                    if (err) {
                    return res.status(500).json({ msg: "Error hashing password" });
                    }

                    if(!result)
                        return res.status(400).send("Password Incorrect")
                    else
                    {
                        let token = jwt.sign({_id:user._id},process.env.JWT_USER_SECRET)
                        res.cookie('token', token)
                        res.send('you are loggedIn')
                    }
    
                });
        }
        catch(e){
            return res.status(500).send("Internal server error")
        }
})

userRouter.get('/purchases',isLoggdInUser,async (req,res) => {
    let userId = req.user._id;
    let courses = await purchaseModel.find({userId:userId}).populate('courseId')
    let courseTitle = courses.map((ele) => {
        return ele.courseId.title // .title works b/c already populated
    })
    res.json({
        msg: "All your purchase courses are",
        courseTitle : courseTitle
    })
})

module.exports = userRouter
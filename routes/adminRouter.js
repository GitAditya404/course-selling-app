const express =require('express')
const adminRouter = express.Router()
const zod = require('zod');
const adminModel = require('../models/adminModel');
const bcrypt  = require('bcrypt')

adminRouter.post('/signup',async (req, res) => {

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
        // return res.status(400).send("invalid Input")
        return res.json({
            msg:    `${result.error.issues.msg} ${result.error.issues.error[0].path}  ${result.error.issues.error[0].message}`
            // msg: result.error.issues
        })
    }

    const {email, firstName, lastName, password} = result.data;
    
    try{
            let user = await adminModel.findOne({email:email})
            if(user)
                return res.status(400).send("Admin already exists")
            
            let saltRounds = 5;
                    bcrypt.hash(password, saltRounds,async function(err, hash) {
                        await adminModel.create({
                            email, 
                            password: hash,
                            firstName, lastName
                        })
                        return res.status(201).send("Admin created Successfuly")
                    });
        }
    
        catch(err){
            return res.status(500).json({
                msg: "Internal Server Error"
            })
        }
})

adminRouter.post('/login', (req, res) => {
    
})


adminRouter.post('/createCourse', (req, res) => {
    res.json({
        msg: "hello from admin login "
    })
})

adminRouter.post('/deleteCourse', (req, res) => {
    res.json({
        msg: "hello from admin login "
    })
})

adminRouter.post('/addContent', (req, res) => {
    res.json({
        msg: "hello from admin login "
    })
})

module.exports = adminRouter
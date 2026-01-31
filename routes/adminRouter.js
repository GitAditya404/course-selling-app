const express =require('express')
const adminRouter = express.Router()
const zod = require('zod');
const adminModel = require('../models/adminModel');
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const isLoggdInAdmin= require('../middlewares/isLoggedInAdmin')
const courseModel = require('../models/courseModel')

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
        return res.send(`${result.error.issues[0].path[0]} ${result.error.issues[0].message}`)
        // return res.send(result.error.issues)
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

adminRouter.post('/login',async (req, res) => {
    const bodySchema = zod.object({
        email : zod.string().email(),
        password : zod.string()
         .min(5, "Password must be at least 5 characters")
            .max(10, "Password must be maxm 10 characters")
    })

    const result = bodySchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            msg: `${result.error.issues.msg} ${result.error.issues.error[0].path}  ${result.error.issues.error[0].message}`
        })
    }

    let {password, email}  = result.data;
    try{
        let admin = await adminModel.findOne({email})
            if(!admin)
                return res.status(404).send("Account not found")
            const hash = admin.password;
            bcrypt.compare(password, hash, function(err, result) {
                if(!result)
                    return res.status(400).send("Password Incorrect")
                else
                {
                    let token = jwt.sign({_id:admin._id},process.env.JWT_ADMIN_SECRET)
                    res.cookie('token', token)
                    res.send('you are loggedIn')
                }

            });
    }
    catch(e){
        return res.status(500).send("Internal server error")
    }
    
})


adminRouter.post('/createCourse',isLoggdInAdmin,async (req, res) => { // not implemented video uploading feature
    let {title, description,price, imageUrl} = req.body;
    const adminId = req.admin._id;
    try{
        const course = await courseModel.create({
            title,description,price,imageUrl,creatorId : adminId
        })
        res.status(200).json({
            msg : "course created successfuly ",
            creatorId : course.creatorId
        })
    }
    catch(err){
        res.send("something went wrong")
    }

})

adminRouter.put('/editCourse',isLoggdInAdmin,async (req, res) => {
    let adminId = req.admin._id
    let {title, description,price, imageUrl, courseId} = req.body;

    await courseModel.updateOne({
        _id: courseId ,
        creatorId:adminId
    },
    {
        title:title,description,price,imageUrl
    })

    res.json({
        msg: "course updated", 
    })

})

adminRouter.get('/course/bulk',isLoggdInAdmin,async (req, res) => {  // it shows all courses an admin has created
    let adminId = req.admin._id;
    let courses = await courseModel.find({creatorId:adminId})
    // res.json({   // this gives you the whole array of objects
    //     courses 
    // })

    let courseTitle = courses.map((ele) => {
        return ele.title
    })
    res.json({
        courseTitle
    })
})

module.exports = adminRouter
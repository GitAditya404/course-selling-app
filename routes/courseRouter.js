const express = require('express')
const courseRouter = express.Router();
const isLoggdInUser = require('../middlewares/isLoggedInUser')
const purchaseModel = require('../models/purchaseModel');
const courseModel = require('../models/courseModel');

courseRouter.get('/purchase',isLoggdInUser,async (req,res) => {
    let userId = req.user._id
    let courseId = req.body.courseId;

    await purchaseModel.create({
        userId, courseId
    })
    res.json({
        msg: "you have successfuly purchased",
        courseId : courseId
    })
})

courseRouter.get('/preview',async (req,res) => {
    let allCourses = await courseModel.find({})
    res.json({
         allCourses
    })
})

module.exports = courseRouter
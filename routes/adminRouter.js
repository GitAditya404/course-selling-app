const express =require('express')
const adminRouter = express.Router()

adminRouter.post('/login', (req, res) => {
    res.json({
        msg: "hello from admin login "
    })
})

adminRouter.post('/signup', (req, res) => {
    res.json({
        msg: "hello from admin login "
    })
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
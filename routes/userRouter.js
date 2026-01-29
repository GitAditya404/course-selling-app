const express = require('express')

const userRouter = express.Router()
// const {Router} = require('express')  // same as above

userRouter.post('/signup', (req,res) => {
    res.send("hello")
})

userRouter.post('/login', (req,res) => {
    res.send("hello")
})

userRouter.post('/purchases', (req,res) => {

})

module.exports = userRouter
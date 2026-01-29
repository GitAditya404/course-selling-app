const express = require('express')
const courseRouter = express.Router();


courseRouter.get('/purchase', (req,res) => {
    res.send("hell")
})

courseRouter.get('/preview', (req,res) => {
    
})

module.exports = courseRouter
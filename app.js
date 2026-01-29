const express = require('express')
const app  = express()
const jwt = require('jsonwebtoken')
const userRouter = require('./routes/userRouter')
const courseRouter = require('./routes/courseRouter')
const adminRouter = require('./routes/adminRouter')

app.use('/api/v1/user',userRouter) // /user ke liye userRouter ko use kro  ;currently this is version 1 of app, when u start working on v2 , u create v2 route but the user still hits v1 route and when v2 finalized then user will hit v2 route
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/admin', adminRouter)
app.listen(3000)
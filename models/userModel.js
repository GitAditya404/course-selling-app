const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('')

const userSchema = new Schema({
    email: String,
    password :String,
    firstName : String,
    LastName : String
})

module.exports = mongoose.model('user',userSchema)



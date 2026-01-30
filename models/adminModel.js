const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password :String,
    firstName : String,
    lastName : String
})

module.exports = mongoose.model('admin',adminSchema)

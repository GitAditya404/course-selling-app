const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl : String,
    creatorId : {
        type :Schema.Types.ObjectId,
        ref: 'admin'
    }
})

module.exports = mongoose.model('course',courseSchema)

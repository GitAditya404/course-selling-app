const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchaseScehma = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    courseId :{
        type: Schema.Types.ObjectId,
        ref: 'course'
    } 
})

module.exports = mongoose.model('purchase',purchaseScehma)



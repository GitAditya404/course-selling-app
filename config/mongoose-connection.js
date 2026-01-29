const mongoose = require('mongoose')

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MongoDB_URI)
    }
    catch(e)
    {
        console.log('error connecting to DB')
        process.exit(1)
    }
}

module.exports = connectDb
const mongoose = require('mongoose')

mongoose.connect(process.env.MongoDB_URI) //mongoose.connect returns a promise
.then(()=> {
    console.log("successfuly connected to DB")
    console.log(mongoose.connection.readyState)
})
.catch((e) => {
    console.log("error connecting to DB")
    process.exit(1)
})

module.exports = mongoose.connection

//mongoose.connect() is an ACTION
// mongoose.connection is the RESULT / STATE of that action

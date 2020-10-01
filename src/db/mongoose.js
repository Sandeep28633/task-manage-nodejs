const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONN_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
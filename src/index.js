const express = require('express')

require('./db/mongoose')

const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const app = express()
const port = process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


//**********************Middleware******************** */
// without middleware==== new request => route handler
// with middleware ===  new request => do something =>route handler
//if we dont call next, then req never goes to routehandler
//,..next means we are done with the middleware, and req can goes to route handler 
//in this application context we dont want middleware to run for login and signin routes..
// so we can define the same in User model / task MOdel



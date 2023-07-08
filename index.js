const express = require('express')
const app = express()
const { dbconnect } = require('./config/database')
const cors = require('cors')
require('dotenv').config()
const session = require('express-session')
const MongoDbStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 4000
const Emitter = require('events')
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: "mongodb+srv://chiraggoyal4520:Chirag%4012@cluster0.wvabnp4.mongodb.net/pizza"
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(
    cors({
        origin : 'http://localhost:3000',
        credentials : true
    })
)
const customerRoutes = require('./routes/customerRoutes')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
dbconnect()
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
app.use('/api/v1/customer',customerRoutes)
app.use('/api/v1/admin',adminRoutes)
app.use('/api/v1/auth',authRoutes)


const server = app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`) 
})
const io = require('socket.io')(server, {
    cors : {
        origin : "http://localhost:3000"
    }
  })

io.on('connection', (socket) => {
    // join the client
    socket.on('join', (roomName) => {
        socket.join(roomName)
    })

})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced',data)
})
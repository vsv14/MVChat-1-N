const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')
const { ExpressPeerServer } = require('peer')
const { createClient } = require('redis');
const redisAdapter = require('@socket.io/redis-adapter');




const server = https.createServer({
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')
  }, app)
const io = require('socket.io')(server)
const peerServer = ExpressPeerServer(server, { debug: true })

const serverId = 0


const pubClient = createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(redisAdapter(pubClient, subClient));


app.use('/peerjs', peerServer)
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.redirect(`/${uuid()}`)
})

app.get('/:room', (req, res)=>{
  res.render('room', {roomId: req.params.room})
})

io.on('connection', socket=>{
  socket.on('join-room', (roomId, userId)=>{
    socket.join(roomId)
    io.to(roomId).emit('user-connected', { userId, roomId})
    

    socket.on('message', ({msg, date, id})=>{
      // const clients = io;
      // console.log('start','romm '+ roomId+" users-> ")
      // console.log(clients.sockets.adapter.sids)
      // console.log('end','--------------------------')

      socket.to(roomId).emit('new-msg', {msg, date, id, roomId, serverId})
    })
  })

  socket.on('log', msg =>{
    logger(msg)
  })
})


function logger(st) {
  console.log(`${Date.now()}`, `log -> ${st}`)
}

server.listen(3000, ()=> console.log('server running...'))
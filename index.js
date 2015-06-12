let express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    bodyParser  = require('body-parser'),
    socketio    = require('socket.io')(http)

let users       = require('./app/backend/dist/js/controller/users'),
    rooms       = require('./app/backend/dist/js/controller/rooms'),
    messages    = require('./app/backend/dist/js/controller/messages')

import Users    from './app/backend/dist/js/model/users'
import Rooms    from './app/backend/dist/js/model/rooms'



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req,res,next) => {
  next()
})

app.use('/api/users', users)
app.use('/api/rooms', rooms)
// app.use('/api/messages', messages)

app.use(express.static(__dirname + '/app/frontend'))
app.use('/doc', express.static(__dirname + '/docs/annotated-source'))

socketio.on('connection', (socket) => {
  console.log('a new user connected')

  // create new user

  let users = new Users()
  let rooms = new Rooms()

  let user = {}
  users.create({_socket: socket.id, name: `User${Date.now()%10000}` }, (result) => {
      socket.emit('newUser', {id: result.id})
      user.id = result.id
      user.name = result.name
  })

  // delete user

  socket.on('disconnect', () => {
    console.log('user disconnected')
    // todo: implement delete function
    users.delete(user.id)
  })

  // add user to chatroom
  socket.on('addUserToChatroom', (obj) => {
      sendMessageToRoom(obj.id, {
        sender: "General",
        text: `User ${user.name} connected`
      }, rooms)

      users.update(user.id, { _room: obj.id })
      
      rooms.one(obj.id, (room) => {
        for(let i = 0, length = room.users.length; i < length; i++) {
          socketio.to(room.users[i]._socket).emit("sendUserlist", room.users.map((item) => { return item["name"] }))
        }
      })

      socket.on('getUserlist', () => {
        rooms.one(obj.id, (room) => {
          socket.emit("sendUserlist", room.users.map((item) => item.name ))
        })
      })
  })

  // remove user from chatroom

  socket.on('removeUserFromChatroom', (room) => {
    users.update(user.id, { _room: null }, () => {
      rooms.one(room.id, (room) => {
        if(room) {
          for(let i = 0, length = room.users.length; i < length; i++) {
            socketio.to(room.users[i]._socket).emit("sendUserlist", room.users.map((item) => { 
              if(item["name"] !== user.name) {
                return item["name"] 
              }
            }))
          }
        }
      })
    })
  })

  // broadcast message to room

  socket.on('sendMessage', (text) => {
      users.one(user.id, (dbUser) => {
        sendMessageToRoom(dbUser._room, {
          sender: dbUser.name,
          text: text
        }, rooms)
      })
  })

})

http.listen(3000, () => {
    console.log('listening on *:3000')
})

function sendMessageToRoom (roomId, message, rooms) {
  rooms.one(roomId, (room) => {
    for(let i = 0, length = room.users.length; i < length; i++) {
      socketio.to(room.users[i]._socket).emit('message', message)
    }
  })
}

import express      from 'express'
import bodyParser   from 'body-parser'
import socketio     from 'socket.io'
import { Server }   from 'http'

import users        from './app/backend/dist/js/controller/users'
import rooms        from './app/backend/dist/js/controller/rooms'
import messages     from './app/backend/dist/js/controller/messages'

import Users        from './app/backend/dist/js/model/users'
import Rooms        from './app/backend/dist/js/model/rooms'

let app             = express(),
    server          = Server(app),
    io              = socketio(server)


// user bodyParser for different content types at posts
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set the url of the api
app.use('/api/users', users)
app.use('/api/rooms', rooms)

// make the path to the frontend and to the documentation public
app.use(express.static(__dirname + '/app/frontend'))
app.use('/doc', express.static(__dirname + '/docs/annotated-source'))

// save the data of the current User with socket id as key
let data = {}

// init models
let roomModel = new Rooms()
let userModel = new Users()

io.on('connection', (socket) => {
  console.log(`${socket.client.conn.remoteAddress} has connected`)

  socket.on('disconnect', () => {
    console.log(`${socket.client.conn.remoteAddress} has disconnected`)
    let obj = {}
    // check if the key and the _id is available
    if(data[socket.id] && data[socket.id]._id){
      obj = {
        roomId: data[socket.id]._room,
        sender: 'General',
        text: `${data[socket.id].name} has left the chat`
      }
      // init the User model
      let uModel = new Users()
      // delete the user from the database
      uModel.delete(data[socket.id]._id)
      // send a message to all clients in the same room of the deleted user
      sendToRoom(obj.roomId, obj, 'chat message')
      // send the data of the deleted user to all clients 
      io.sockets.emit("removeUser", { user: data[socket.id] })
      // remove the entry out of the hash
      delete data[socket.id]
    }
  })

  socket.on('error', (err) => {
    console.log(err)
  })

  // new user created
  socket.on('newUser', (obj) => {
    obj.sender = 'General'
    obj.text = `${obj.user.name} has connected`
    // save the data of the created user
    data[socket.id] = obj.user
    // send a message to all users in the same room
    sendToRoom(obj.roomId, obj, 'chat message')
    if(obj.roomId) {
      // if the roomId is given, emit 'addUserToRoom'
      io.sockets.emit('addUserToRoom', obj)
    }
  })

  // listen on 'sendMessage'
  socket.on('sendMessage', (data = {}) =>{
    // send a message to all clients in the given room
    sendToRoom(data.roomId, data, 'chat message')
  })

  // listen on deleteRoom
  socket.on('deleteRoom', (data) => {
    // emit 'removeRoom' with the data of the room as parameter
    io.sockets.emit('removeRoom', data)
  })

  // listen on createRoom
  socket.on('createRoom', (data) => {
    // emit 'roomCreated' with the data of the room as parameter
    io.sockets.emit('roomCreated', data)
  })

  // listen on 'addUserToChatroom'
  socket.on('addUserToChatroom', (obj) => {
    // set the users attributes to the data hash
    data[socket.id] = obj.user
    // overwrite the room id
    data[socket.id]._room = obj.roomId
    // emit 'userToChatroom' to all clients with the users attributes as parameter
    io.sockets.emit('userToChatroom', { user: data[socket.id] })
  })

  // listen on 'removeUserFromChatroom'
  socket.on('removeUserFromChatroom', (data) => {
    // set the object to message all clients
    let obj = {
      sender: 'General',
      text: `${data.user.name} has left the chat`
    }
    // send the message to all clients in the given users room
    sendToRoom(data.user._room, obj, 'chat message')
    // emit 'removeUser' with the users attributes as parameter
    io.emit("removeUser", { user: data.user })
  })

  // function to send a message to all clients in the given room
  let sendToRoom = (roomId, data, action) => {
    // get the room with the given id
    roomModel.one(roomId, (room) => {
      // if it is available
      if( room ) {
        // loop through all users
        for(let user of room.users){
          // send the message to every user
          io.to(user._socket).emit(action, data)
        }
      }
    })
  }
})

// start the server on port 3000
server.listen(3000, () => {
    console.log('listening on *:3000')
})

let express 		= require('express'),
		app 				= express(),
		http 				= require('http').Server(app),
		bodyParser 	= require('body-parser'),
    socketio    = require('socket.io')(http)

let users				= require('./app/backend/dist/js/controller/users'),
		rooms				= require('./app/backend/dist/js/controller/rooms'),
    messages    = require('./app/backend/dist/js/controller/messages')

import Users    from './app/backend/dist/js/model/users'



app.use(bodyParser.urlencoded({ extended: true }))

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
  let user = {}
  users.create({_socket: socket.id}, (result) => {
      socket.emit('newUser', {id: result.id})
      user.id = result.id
      user.name = result.name
  })

  // delete user

  socket.on('disconnect', () => {
    console.log('user disconnected')
    // todo: implement delete function
  })

  // add user to chatroom

  socket.on('addUserToChatroom', (obj) => {
    sendMessageToRoom(obj.id, {
      sender: "General",
      text: `User ${user.name} connected`
    })
    users.update(user.id, { _room: obj.id })
  })
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})

function sendMessageToRoom (roomId, message) {
  console.log(`New message to room: ${message.text}`)
  /*
  todo:
  find all users with _room == roomId
  send message to users
  */
}

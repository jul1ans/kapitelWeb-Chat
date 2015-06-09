let express 		= require('express'),
		app 				= express(),
		http 				= require('http').Server(app),
		bodyParser 	= require('body-parser')

let users				= require('./app/backend/dist/js/controller/users'),
		rooms				= require('./app/backend/dist/js/controller/rooms')


app.use(bodyParser.urlencoded({ extended: true }))

app.use((req,res,next) => {
  next()
})

app.use('/api/users', users)
app.use('/api/rooms', rooms)

app.use(express.static(__dirname + '/app/frontend'))
app.use('/doc', express.static(__dirname + '/docs/annotated-source'))

http.listen(3000, () => {
    console.log('listening on *:3000')
})

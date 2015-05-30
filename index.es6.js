let express = require('express'),
		app 		= express(),
		http 		= require('http').Server(app),
		api			= require('app/backend/js/controller/api')

let mongo = require('mongodb'),
		monk = require('monk'),
		db = monk('localhost:27017/nodetest1')

let users		= require('app/backend/js/controller/users'),
		rooms		= require('app/backend/js/controller/rooms')



app.use((req,res,next) => {
    req.db = db;
    next();
})

app.use('/api', api)

app.use(express.static(__dirname + '/app/frontend'))
app.use('/doc', express.static(__dirname + '/docs/annotated-source'))

http.listen(3000, () => {
    console.log('listening on *:3000');
})

let dburl = process.env.DB_URL || 'mongodb://localhost:27017/es6chat'

let mongoose 	= require('mongoose')
mongoose 			= mongoose.connect(dburl)

let { Schema } = mongoose

let Room = new Schema({
	name: { type: String, default: `Room${Date.now()}` },
	users: { type: Array, default: [] }
})

let User = new Schema({
    name:  { type: String, default: `User${Date.now()}` },
    _room: { type: String, default: null }
})

let UserModel = mongoose.model('User', User);
let RoomModel = mongoose.model('Room', Room);

exports.mongoose 	= mongoose
exports.UserModel = UserModel
exports.RoomModel = RoomModel

let mongoose 	= require('mongoose')
mongoose 			= mongoose.connect('mongodb://localhost:27017/es6chat')

let { Schema } = mongoose

let Room = new Schema({
	name: { type: String, default: `Room${Date.now()}` }
})

let User = new Schema({
    name:  { type: String, default: `User${Date.now()}` },
    _room: { type: Number, default: null }
})

let UserModel = mongoose.model('User', User);
let RoomModel = mongoose.model('Room', Room);

exports.UserModel = UserModel
exports.RoomModel = RoomModel

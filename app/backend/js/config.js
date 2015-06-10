import mongoose from 'mongoose'

let dburl = process.env.DB_URL || 'mongodb://localhost:27017/es6chat'

let mongo = mongoose.connect(dburl)

let { Schema } = mongo

let Room = new Schema({
	name: { type: String, default: `Room${Date.now()}` },
	users: { type: Array, default: [] }
})

let User = new Schema({
    name:  { type: String, default: `User${Date.now()}` },
    _room: { type: String, default: null },
    _socket: { type: String, default: null }
})

let UserModel = mongo.model('User', User);
let RoomModel = mongo.model('Room', Room);

export default {
	mongoose: 	mongo,
	UserModel,
	RoomModel
}

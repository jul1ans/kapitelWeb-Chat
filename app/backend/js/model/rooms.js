let { RoomModel, UserModel, mongoose }     = require('../config'),
    { filterByKeys }            = require('./helper')

class Rooms {

    constructor () {
        this.mongoose = mongoose
        this.model = RoomModel
    }

    all(cb) {
        this.model.find((err, rooms) => {
            UserModel.find((err, users) => {
                rooms = rooms.map((room) => {
                    room.users = users.filter((user) => {
                        return user._room === room._id.toString()
                    })
                    return room
                })

                if( typeof cb === 'function' ) {
                    cb(rooms)
                }
            })
        })
    }

    one(id, cb) {
        this.model.findById(id, (err, room) => {
            if( typeof cb === 'function' ) {
                cb(room)
            }
        })
    }

    create(opt, cb) {
        opt = filterByKeys(opt, 'name')
        let room = new this.model(opt)
        room.save((err) => {
            if ( typeof cb === 'function' ) {
                cb(room)
            }
        })
    }

    update(id, opt, cb) {
        opt = filterByKeys(opt, 'name', '_room')
        this.one(id, (room) => {
            room.name = opt.name
            room._room = opt._room
            room.save((err) => {
                if ( typeof cb === 'function' ) {
                    cb(room)
                }
            })
        })
    }

    delete(id, cb) {
        this.one(id, (room) => {
            room.remove((err) => {
                if ( typeof cb === 'function' ) {
                    cb(room)
                }
            })
        })
    }
}


module.exports = Rooms
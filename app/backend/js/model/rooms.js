import {
    RoomModel,
    UserModel,
    mongoose
} from '../config'
import { filterByKeys } from './helper'

class Rooms {

    constructor () {
        this.mongoose = mongoose
        this.model = RoomModel
    }

    all(cb) {
        this.model.find((err, rooms) => {
            Rooms.joinWithUsers(rooms, cb)
        })
    }

    one(id, cb) {
        this.model.findById(id, (err, room) => {
            Rooms.joinWithUsers(room, cb)
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

    static joinWithUsers(rooms, cb) {
        let isArray = Object.prototype.toString.call(rooms) === '[object Array]'
        if(!isArray) {
            rooms = [ rooms ]
            isArray = false
        }

        UserModel.find((err, users) => {
            rooms = rooms.map((room) => {
                room.users = users.filter((user) => {
                    return user._room === room._id.toString()
                })
                return room
            })

            if( typeof cb === 'function' ) {
                if(isArray){
                    cb(rooms)
                }
                else {
                    cb(rooms[0])
                }
            }
        })
    }
}


export default Rooms
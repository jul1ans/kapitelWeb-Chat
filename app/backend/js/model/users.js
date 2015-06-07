//require("babel/polyfill");

let { UserModel }     = require('../config')


class Users {

    constructor () {
        this.model = UserModel
    }

    all(cb) {
        this.model.find((err, users) => {
            if( typeof cb === 'function' ) {
                cb(users)
            }
        })
    }

    one(id, cb) {
        this.model.findById(id, (err, user) => {
            if( typeof cb === 'function' ) {
                cb(user)
            }
        })
    }

    create(opt, cb) {
        let user = new this.model({
            name: opt.name || `User${Date.now()}`,
            room: opt.room
        })
        user.save((err) => {
            if ( typeof cb === 'function' ) {
                cb(user)
            }
        })
    }

    update(id, opt, cb) {
        opt = this.filterByKey(opt, 'name', 'room')
        this.one(id, (user) => {
            user.name = opt.name
            user.room = opt.room
            user.save((err) => {
                if ( typeof cb === 'function' ) {
                    cb(user)
                }
            })
        })
    }

    delete(id, cb) {
        this.one(id, (user) => {
            user.remove((err) => {
                if ( typeof cb === 'function' ) {
                    cb(user)
                }
            })
        })
    }

    static filterByKey(obj, ...attr) {
        let newObj = {}
        for (let key of Object.keys(obj)) {
            for (let a of attr) {
                if(a === key) {
                    newObj[key] = obj[key]
                }
            }
        }
        return newObj
    }
}


module.exports = Users
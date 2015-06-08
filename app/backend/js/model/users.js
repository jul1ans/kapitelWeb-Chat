let { UserModel, mongoose }     = require('../config'),
    { filterByKeys }            = require('./helper')

class Users {

    constructor () {
        this.mongoose = mongoose
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
        opt = filterByKeys(opt, 'name', '_room')
        let user = new this.model(opt)
        user.save((err) => {
            if(err){
                throw err
            }
            if ( typeof cb === 'function' ) {
                cb(user)
            }
        })
    }

    update(id, opt, cb) {
        opt = filterByKeys(opt, 'name', '_room')
        this.one(id, (user) => {
            user.name = opt.name
            user._room = opt._room
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
}


module.exports = Users
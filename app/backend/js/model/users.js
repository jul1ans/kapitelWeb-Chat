//require("babel/polyfill");

let express 	= require('express'),
	router 		= express.Router(),
    { db }      = require('../config')


class Users {

    constructor () {
        this.db = db
    }

    all(cb) {
        this.db.find({}).toArray((err, users) => {
            if( typeof cb === 'function' ) {
                cb(users)
            }
        })
    }

    one(id, cb) {
        this.db.findById(id, (err, user) => {
            if( typeof cb === 'function' ) {
                cb(user)
            }
        })
    }

    create(opt, cb) {
        this.db.insert({ name: opt.name, room: opt.room }, (err, result) => {
            if (err) { throw error }
            if ( typeof cb === 'function' ) {
                cb(result)
            }
        })
    }

    update(id, opt, cb) {
        opt = this.filterByKey(opt, 'name', 'room.$id')
        this.db.updateById(id, {$set: opt}, (err, result) => {
            if (err) { throw error }
            if ( typeof cb === 'function' ) {
                cb(result)
            }
        })
    }

    delete(id, cb) {
        this.db.removeById(id, (err, result) => {
            if (err) { throw error }
            if ( typeof cb === 'function' ) {
                cb(result)
            }
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
require("babel/polyfill");

let express 	= require('express'),
	router 		= express.Router()

/*
 *	GET USERS
 *	get all users
 */
router.get('/', (req, res) => {
    let db = bindDatabase(req.db)
    db.users.find({}).toArray((err, items) => {
        res.json(items)
    })
})

/*
 *	GET USERS/ID
 *	get user with given id
 */
router.get('/:id', (req, res) => {
    let db = bindDatabase(req.db)
    db.users.findById(req.params.id, (err, user) => {
        res.json(user)
    })
})

/*
 *	POST USERS
 *	create new user and return the created object
 */
router.post('/', (req, res) => {
    let db = bindDatabase(req.db)
    let name = req.body.name || 'chatclientRandom'
    let room = {
        $ref: 'room',
        $id: req.body.room_id || null
    }
    db.users.insert({ name: name, room: room }, (err, result) => {
    	if (err) { throw error }
    	res.json(result)
    })
})

/*
 *	UPDATE USERS/ID
 *	update user with given id
 */
router.put('/:id', (req, res) => {
    let db = bindDatabase(req.db)
    let obj = filterByKey(req.body, 'name', 'room.$id')
    db.users.updateById(req.params.id, {$set: obj}, (err, result) => {
    	if (err) { throw error }
    	res.json(result)
    })
})

/*
 *	DELETE USERS/ID
 *	remove user with given id
 */
router.delete('/:id', (req, res) => {
    let db = bindDatabase(req.db)
    db.users.removeById(req.params.id, (err, result) => {
    	if (err) { throw error }
    	res.json(result)
    })
})

let filterByKey = (obj, ...attr) => {
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

let bindDatabase = (db) => {
	db.bind('users')
	return db
}

module.exports = router
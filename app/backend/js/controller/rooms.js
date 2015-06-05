require("babel/polyfill");

let express 	= require('express'),
	router 		= express.Router()

/*
 *	GET ROOMS
 *	get all rooms
 */
router.get('/', (req, res) => {
    let db = bindDatabase(req.db)
    db.rooms.find().toArray((err, items) => {
        res.json(items)
    })
})

/*
 *	GET ROOMS/ID
 *	get user with given id
 */
router.get('/:id', (req, res) => {
    let db = bindDatabase(req.db)
    db.rooms.findById(req.params.id, (err, items) => {
        res.json(items)
    })
})

/*
 *	POST ROOMS
 *	create new user and return the created object
 */
router.post('/', (req, res) => {
    let db = bindDatabase(req.db)
    let name = req.body.name || 'roomRandom'
    db.rooms.insert({ name: name }, (err, result) => {
    	if (err) { throw error }
    	res.json(result)
    })
})

/*
 *	UPDATE ROOMS/ID
 *	update user with given id
 */
router.put('/:id', (req, res) => {
    let db = bindDatabase(req.db)
    let obj = filterByKey(req.body, 'name')
    db.rooms.updateById(req.params.id, {$set: obj}, (err, result) => {
    	if (err) { throw error }
    	res.json(result)
    })
})

/*
 *	DELETE ROOMS/ID
 *	remove user with given id
 */
router.delete('/:id', (req, res) => {
    let db = bindDatabase(req.db)
    db.rooms.removeById(req.params.id, (err, result) => {
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
	db.bind('rooms')
	return db
}

module.exports = router
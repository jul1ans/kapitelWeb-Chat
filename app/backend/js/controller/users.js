let express 	= require('express'),
	router 		= express.Router()

let Users       = require('../model/users')

/*
 *	GET USERS
 *	get all users
 */
router.get('/', (req, res) => {
    let users = new Users(req.config)
    users.all((users) => {
        res.json(users)
    })
})

/*
 *	GET USERS/ID
 *	get user with given id
 */
router.get('/:id', (req, res) => {
    let users = new Users(req.config)
    users.one(req.params.id, (users) => {
        res.json(users)
    })
})

/*
 *	POST USERS
 *	create new user and return the created object
 */
router.post('/', (req, res) => {
    let users = new Users(req.config)
    users.create(req.body, (result) => {
        res.json(result)
    })
})

/*
 *	UPDATE USERS/ID
 *	update user with given id
 */
router.put('/:id', (req, res) => {
    let users = new Users(req.config)
    users.update(req.params.id, req.body, (result) => {
        res.json(result)
    })
})

/*
 *	DELETE USERS/ID
 *	remove user with given id
 */
router.delete('/:id', (req, res) => {
    let users = new Users(req.config)
    users.delete(req.params.id, (result) => {
        res.json(result)
    })
})

module.exports = router
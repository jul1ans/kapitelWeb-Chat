import express  from 'express'
import Rooms    from './../model/rooms'

let router = express.Router()

/*
 *  GET USERS
 *  get all rooms
 */
router.get('/', (req, res) => {
    let rooms = new Rooms()
    rooms.all((rooms) => {
        res.json(rooms)
    })
})

/*
 *  GET USERS/ID
 *  get user with given id
 */
router.get('/:id', (req, res) => {
    let rooms = new Rooms()
    rooms.one(req.params.id, (rooms) => {
        res.json(rooms)
    })
})

/*
 *  POST USERS
 *  create new user and return the created object
 */
router.post('/', (req, res) => {
    let rooms = new Rooms()
    rooms.create(req.body, (result) => {
        res.json(result)
    })
})

/*
 *  UPDATE USERS/ID
 *  update user with given id
 */
router.put('/:id', (req, res) => {
    let rooms = new Rooms()
    rooms.update(req.params.id, req.body, (result) => {
        res.json(result)
    })
})

/*
 *  DELETE USERS/ID
 *  remove user with given id
 */
router.delete('/:id', (req, res) => {
    let rooms = new Rooms()
    rooms.delete(req.params.id, (result) => {
        res.json(result)
    })
})

export default router
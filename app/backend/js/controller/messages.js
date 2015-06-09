import express  from 'express'

let router = express.Router()

/*
 *  GET MESSAGES
 *  get all messages
 */
router.get('/', (req, res) => {
    console.log("implement - return all messages")
})

export default router
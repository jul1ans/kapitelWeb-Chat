let express 	= require('express'),
		router 		= express.Router();

/*
 *	GET ROOMS
 *	get all rooms
 */
router.get('/', function(req, res) {
    let db = req.db;
    db.collection('rooms').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
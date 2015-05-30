let express 	= require('express'),
		router 		= express.Router();

/*
 *	GET USERS
 *	get all users
 */
router.get('/', function(req, res) {
    let db = req.db;
    db.collection('users').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
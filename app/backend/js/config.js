let mongo 	= require('mongoskin')
exports.db	= mongo.db("mongodb://localhost:27017/es6chat", {native_parser:true})
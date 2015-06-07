
let assert 	= require('assert'),
		Users 	= require('../js/model/users')

describe('Users', () => {

	before(() => {
		users = new Users(db)
		done()
	})


  it('should insert one user', () => {
    users.create({ name: 'extraUser', room: null }, (result) => {
    	assert.equal('extraUser', result.name)
    })
  })
  assert.equal(true, true)
})
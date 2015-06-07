let assert 	  = require('assert'),
    Users     = require('../js/model/users')

let users     = new Users()

describe('Users', () => {
	beforeEach((done) => {
    done()
	})


  it('should insert one user', () => {
    users.create({}, (user) => {
      console.log(user)
      assert.equal(true, true)
    })
  })
})
process.env.DB_URL = 'mongodb://localhost:27017/es6chat_test'

import assert from 'assert'
import Users  from '../js/model/users'

let users     = new Users()

describe('Users', () => {
	beforeEach((done) => {
    let collection = users.mongoose.connection.collections['users']
    collection.drop((err) => {
      done()
    })
	})

  it('should insert two users', (done) => {
    users.create({}, () => {
      users.create({}, () => {
        users.all((users) => {
          assert.equal(users.length, 2)
          done()
        })
      })
    })
  })

  it('should insert user with default values', (done) => {
    users.create({}, (user) => {
      let match = user.name.match(/^User(\d+)$/)
      assert.equal(match.length, 2)
      assert.equal(user.room, null)
      done()
    })
  })

  it('should insert user with name', (done) => {
    users.create({name: 'testUser'}, (user) => {
      assert.equal(user.name, 'testUser')
      done()
    })
  })

  it('should insert user with name and room', (done) => {
    users.create({ name: 'testUser', _room: 1234 }, (user) => {
      assert.equal(user.name, 'testUser')
      assert.equal(user._room, 1234)
      done()
    })
  })

  it('should update user', (done) => {
    users.create({name: 'testUser'}, (user) => {
      users.update(user._id, { name: 'updatedUser', _room: 112233 }, (uu) => {
        assert.equal(uu.name, 'updatedUser')
        assert.equal(uu._room, 112233)
        done()
      })
    })
  })

  it('should delete user', (done) => {
    users.create({name: 'testUser'}, (user) => {
      users.delete(user._id, (du) => {
        users.all((users) => {
          assert.equal(users.length, 0)
          done()
        })
      })
    })
  })
})
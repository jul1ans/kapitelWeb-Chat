process.env.DB_URL = 'mongodb://localhost:27017/es6chat_test'

import assert from 'assert'
import Rooms  from '../js/model/rooms'

let rooms     = new Rooms()

describe('Rooms', () => {
	beforeEach((done) => {
    let collection = rooms.mongoose.connection.collections['rooms']
    collection.drop((err) => {
      done()
    })
	})

  it('should insert two rooms', (done) => {
    rooms.create({}, () => {
      rooms.create({}, () => {
        rooms.all((rooms) => {
          assert.equal(rooms.length, 2)
          done()
        })
      })
    })
  })

  it('should insert room with default values', (done) => {
    rooms.create({}, (room) => {
      let match = room.name.match(/^Room(\d+)$/)
      assert.equal(true, match.length > 0)
      done()
    })
  })

  it('should insert room with name', (done) => {
    rooms.create({name: 'testRoom'}, (room) => {
      assert.equal(room.name, 'testRoom')
      done()
    })
  })

  it('should update room', (done) => {
    rooms.create({name: 'testRoom'}, (room) => {
      rooms.update(room._id, { name: 'updatedRoom' }, (ur) => {
        assert.equal(ur.name, 'updatedRoom')
        done()
      })
    })
  })

  it('should delete room', (done) => {
    rooms.create({name: 'testRoom'}, (room) => {
      rooms.delete(room._id, (dr) => {
        assert(dr.name, 'testRoom')
        rooms.all((rooms) => {
          assert.equal(rooms.length, 0)
          done()
        })
      })
    })
  })
})
# kapitelWeb-Chat

## Setup

### clone this repo
```
git clone git@github.com:jul1ans/kapitelWeb-Chat.git
```

### init the project

install the modules
```
npm i
```

build the project
```
grunt build
```

run mongodb in an other terminal
```
mongod
```

start and love it
```
grunt serve
```

## API
The URL to the api always begins with **/api**

### Users
#### All users
get an array with all users
```
URL: http://localhost:3000/api/users
Method: GET
```

#### One user
get the data of the user with the given id. if user is not found the API returns null.
```
URL: http://localhost:3000/api/users/:id
Method: GET
```

#### Create user
Create a user with the given params.
```
URL: http://localhost:3000/api/users/
Method: POST
Data: { name: <Name of User>, room: <ID of the Chatroom>  }
```

#### Update user
Update the attributes of the user with the given id
```
URL: http://localhost:3000/api/users/:id
Method: PUT
Data: { name: <Name of the User>, Room: <ID of the Chatroom> }
```

#### Delete user
Delete the user with the given id
```
URL: http://localhost:3000/api/users/:id
Method: DELETE
```

### Rooms
#### All rooms
get an array with all rooms
```
URL: http://localhost:3000/api/rooms
Method: GET
```

#### One room
get the data of the room with the given id. if room is not found the API returns null.
```
URL: http://localhost:3000/api/rooms/:id
Method: GET
```

#### Create room
Create a room with the given params
```
URL: http://localhost:3000/api/rooms/
Method: POST
Data: { }
```

#### Update room
Update the attributes of the room with the given id
```
URL: http://localhost:3000/api/rooms/:id
Method: PUT
Data: { name: <Name of the Chatroom> }
```

#### Delete room
Delete the room with the given id
```
URL: http://localhost:3000/api/rooms/:id
Method: DELETE
```

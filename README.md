# kapitelWeb-Chat
## Table of Contents
1. [Setup](#setup)
2. [API](#api)
3. [Documentation](#documentation)

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

visit the API Documentation in the [API.md](https://github.com/jul1ans/kapitelWeb-Chat/blob/master/API.md)

## DOCUMENTATION

The documentation is generated by docco. To generate it run
```
grunt doc
```

This will create a **doc/** folder in your root path. To see the documentation run the project with 
`grunt serve` and browse to **localhost:3000/doc**. On the right upper corner you can switch between
the files.

## TEST
Befor test the application you have to run the build prozess with `grunt build`.
To test the application run
```
grunt test
```

This will show the result of the mocha test and if the server is running you can visit the coverage on
**localhost:3000/cov/lcov-report/**


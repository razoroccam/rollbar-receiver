'use strict'

const url = require('url')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongodb = require('mongodb')
const Measured = require('measured')
const pkg = require('./package')

/**
 * CONFIG STARTS HERE
 */

// Some nasty hard coded config item
// Mongodb collection we write to
const EXCEPTION_COLLECTION = 'items'
// NOTE: bump this when we decide to change how we store exceptions, hopefully this
// will allow us to query different formats in slightly less than completely rubbish way
const STORAGE_FORMAT = 'v0'

// (enviroment) configuration happens here
const PORT = process.env['PORT'] || 3000
const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost/rollbar'

/**
 * APP WIRING STARTS HERE
 */

// Start wiring up the actual app
// TODO: wrap this up in a simple App class

// TODO: record some actual stats
const stats = Measured.createCollection() // eslint-disable-line no-unused-vars
const app = express()

// TODO: work out a good limit for upload sizes (default 100kb)
const jsonBodyParser = bodyParser.json()
const logger = morgan('combined')

// stop sending uncessary info..
app.set('x-powered-by', false)
// TODO: add switch for this, for now just assume (in prod) that we are always behind
// an http router/proxy/load-balancer
app.set('trust proxy', true)

// This middleware should go first so we log ALL the requests
app.use(logger)
// Add metrics here
// TODO: better configure cors settings to be less open to the world
app.use(cors())

app.get('/', function (req, res) {
  res.status(200).send('hi')
})

// I love ping endpoints
app.get('/ping', function (req, res) {
  res.status(200).send('pong')
})

// Exception/item recieving endpoint (as per rollbar server API)
// TODO: maybe we should rate limit this one day?
// TODO: actually validate the input at all :-p
app.post('/item/', jsonBodyParser, function (req, res) {
  // NOTE: when you have no idea what a tracked exception looks like, uncomment this line below to see
  // console.log(JSON.stringify(req.body))

  const doc = {
    version: STORAGE_FORMAT,
    data: req.body.data, // Actual received data
    project: req.body.access_token, // Duplicated for easier search
    enviroment: req.body.data.environment, // Duplicated for easier search
    remote_ip: req.ip // Used for $remote_ip variable substition
  }

  const insertOneWriteOpCallback = function (err, insertOneWriteOpResultObject) {
    // TODO: filter/handle errors in a more fine grained way
    if (err) {
      console.log('[Error] could not write user item to mongodb: %s', err)
      res.status(500).send('unable to save item')
      return
    }
    // TODO: validate op was as expected?
    insertOneWriteOpResultObject // Stops eslint complaining about it not being used
    // Rollbar client expects 200 exactly and not any other 2xx code
    res.status(200).end()
  }
  // Lol @ law of Demeter
  req.app.locals.db.collection(EXCEPTION_COLLECTION).insertOne(doc, insertOneWriteOpCallback)
})

/**
 * RUNTIME STARTS HERE
 */

// bit that needs flow control stuff
console.log(`[Info] starting ${pkg.name}@${pkg.version}`)
console.log(`[Info] connecting to ${maskUriAuth(MONGODB_URI)}`)
mongodb.MongoClient.connect(MONGODB_URI, function (err, db) {
  if (err) {
    console.log('[Error] could not connect to database: %s', err)
    process.exit(1)
  }
  console.log('[Info] connected to database')

  // Set our connection as some global state!
  app.locals.db = db

  const httpServer = app.listen(PORT, function () {
    console.log(`[Info] listening on port ${PORT}`)
  })

  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)

  function gracefulShutdown () {
    console.log('[Info] application shutdown requested')
    httpServer.close(function () {
      console.log('[Info] http server closed')
      db.close(function (err) {
        if (err) {
          console.log('[Error] error whilst closing database connection: %s', err)
          process.exit(1)
        }
        console.log('[Info] database connection closed')
        console.log('[Info] good bye')
        process.exit(0)
      })
    })
  }
})

/**
 * UTILS STUFF
 */

/**
 * masks any user:pass auth info present in a uri string
 * @param  {String} uriString [description]
 * @return {String}           [description]
 */
function maskUriAuth (uriString) {
  const urlObj = url.parse(uriString)

  // No auth present
  if (urlObj.auth === null) {
    return uriString
  }

  urlObj.auth = urlObj.auth.split(':').map(mask).join(':')

  return url.format(urlObj)

  function mask (info) {
    return '****'
  }
}

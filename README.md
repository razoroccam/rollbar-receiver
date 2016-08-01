# Rollbar Reciever

[![Build Status](https://travis-ci.org/razoroccam/rollbar-receiver.svg?branch=master)](https://travis-ci.org/razoroccam/rollbar-receiver)

A tiny API server for receiving tracked exceptions from client (browser/server) side rollbar instances

## Status / Notes

Basically a POC, does nothing other than store received exceptions in mongodb. It should work with anything the
client can send to the actual rollbar API. (see here for actual API docs https://rollbar.com/docs/api/items_post/).

This allows you to inspect and debug what is goetting sent by clients

In production the mongodb collection where exceptions are stored should be a capped collection
just stop everything completely falling over if firehosed by clients. This is sub-optimal 
but "good" enough for now.

## Configuration

- `PORT`: port the HTTP server will bind to and listen on. Default `3000`
- `MONGODB_URI`: uri for mongodb instance to connect to. Default `mongodb://localhost/rollbar`

## Usage

either `npm start` or `node index.js`

In the rollbar client set the the `endpoint` url to point to an installation of this server.
We do not use the `accessToken` for authentication yet, but you should make it the "project name" or something
so that searching exceptions in the database is easier.

e.g (other keys are purely for illustrative purposes)

```
var _rollbarConfig = {
    accessToken: "YOUR_PROJECT_NAME",
    captureUncaught: true,
    captureUnhandledRejections: false,
    endpoint: "https://api.example.com/",
    payload: {
        environment: "production"
    }
};

// Rollbar snippet goes here: https://rollbar.com/docs/notifier/rollbar.js/

```

Exceptions can then read direct from mongodb (for now).

## Development

no tests as yet.
Linting is done with eslint via `npm run lint` and `npm run lint-fix`
There is a scattering of docs in `./docs`

## TODO

- some basic query interface would be good (maybe start with cli tool?)
- basic user input validation or formatting checks
- metrics of some kind (expceptions per min/sec per accessToken+enviroment)
- use API keys properly (this seems a lot of work for zero fun right now)
- actually think about a useful storage format and maybe some input manipulation
- store exceptions/messages in different collections (if we ever use message)
- add some kind basic of rollup / aggregation
- database setup scripts
>>>>>>> initial commit

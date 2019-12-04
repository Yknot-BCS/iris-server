const DataPump = require('./DataPump')
const MessageRouter = require('../routing/MessageRouter')
const MessageSubscription = require('../routing/MessageSubscription')
const PostListener  = require('../webserver/PostListener')
// const WebSocket = require('ws')
const assert = require('assert')
//const IrisClient = require('@caleos/iris-client')
const JWTService = require('../jwt/JWTService')
const axios = require('axios')
const chronicleListenerPort = 8801
//const clientListenerPort = 8880
const issues = [
    {
        block: 20,
        to: 'eosio',
        quantity: '178473249.3125 TLOS',
        memo: 'Genesis Snapshot',
        transactionId: '9a980697f93dc3418d3639f149a39fa726193d92a25613189aa8629697e14c04'
    }, {
        block: 20,
        to: 'eosio',
        quantity: '6000000.0000 TLOS',
        memo: 'Telos Foundation Issue',
        transactionId: '9a980697f93dc3418d3639f149a39fa726193d92a25613189aa8629697e14c04'
    }, {
        block: 20,
        to: 'eosio',
        quantity: '18000000.0000 TLOS',
        memo: 'Telos Founders Reward Pool Issue',
        transactionId: '9a980697f93dc3418d3639f149a39fa726193d92a25613189aa8629697e14c04'
    }, {
        block: 20,
        to: 'eosio',
        quantity: '1000000.0000 TLOS',
        memo: 'Telos Community Reward Pool Issue',
        transactionId: '9a980697f93dc3418d3639f149a39fa726193d92a25613189aa8629697e14c04'
    }, {
        block: 20,
        to: 'eosio',
        quantity: '140279973.0000 TLOS',
        memo: 'Exchange Pool',
        transactionId: '9a980697f93dc3418d3639f149a39fa726193d92a25613189aa8629697e14c04'
    }, {
        block: 20,
        to: 'eosio',
        quantity: '25000.0000 TLOS',
        memo: 'Genesis Account RAM Issue',
        transactionId: '9a980697f93dc3418d3639f149a39fa726193d92a25613189aa8629697e14c04'
    }
]

const rows = [{ "block_num": "20", "block_timestamp": "2018-12-08T19:37:31.500", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778222.3125 TLOS" } } },
{ "block_num": "23", "block_timestamp": "2018-12-08T19:37:33.000", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778215.9849 TLOS" } } },
{ "block_num": "24", "block_timestamp": "2018-12-08T19:37:33.500", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778211.7665 TLOS" } } },
{ "block_num": "25", "block_timestamp": "2018-12-08T19:37:34.000", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778207.5481 TLOS" } } },
{ "block_num": "26", "block_timestamp": "2018-12-08T19:37:34.500", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778201.2205 TLOS" } } },
{ "block_num": "27", "block_timestamp": "2018-12-08T19:37:35.000", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778197.0021 TLOS" } } },
{ "block_num": "28", "block_timestamp": "2018-12-08T19:37:35.500", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778192.7837 TLOS" } } },
{ "block_num": "29", "block_timestamp": "2018-12-08T19:37:36.000", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778186.4561 TLOS" } } },
{ "block_num": "30", "block_timestamp": "2018-12-08T19:37:36.500", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778182.2377 TLOS" } } },
{ "block_num": "31", "block_timestamp": "2018-12-08T19:37:37.000", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778178.0193 TLOS" } } },
{ "block_num": "32", "block_timestamp": "2018-12-08T19:37:37.500", "added": "true", "kvo": { "code": "eosio.token", "scope": "eosio", "table": "accounts", "primary_key": "1397705812", "payer": "eosio", "value": { "balance": "343778171.6917 TLOS" } } }]
let pl = new PostListener()
pl.start()
let jwt = new JWTService()
/**
 * Write test to read file
 * Write test to check jwt
 * write test for unsubscribe
 * write test for sublist
 */
describe('PostListener.addSubscription()', () => {
  it('should subscribe client to subscription', async () => {
      try {
        let payload = { account: 'coolxtestwlt' }
        let token = jwt.sign(payload)
        axios.post('http://127.0.0.1:8080/addSubscription',  { token } )
        .then((res) => {
          console.log(`statusCode: ${res.data}`)
          let subCount = Object.entries(pl.getSubscriptions()).length
          assert.equal(subCount, 1)
        })
        .catch((error) => {
          console.error("error")
          let subCount = Object.entries(pl.getSubscriptions()).length
          assert.equal(subCount, 1)
        })
      } finally {
          //done()
      }
  })
})

describe('PostListener.addSubscription()', () => {
  it('should recieve JSON message containing block information from subscription', async () => {
      try {
          let subMessage = ''
          let dataPump = new DataPump(chronicleListenerPort, 93627, './test/data/')
          let client = new IrisClient(`ws://localhost:${clientListenerPort}`)
          await client.connect()

          client.subscribeAction('eosio.token::issue', (message) => {
              subMessage = JSON.stringify(message)
          })
          await dataPump.pump()
          client.disconnect()

        let payload = { account: 'eosio.token' }
        let token = jwt.sign(payload)
        axios.post('http://127.0.0.1:8080/addSubscription',  { token } )
        .then((res) => {
          console.log(`statusCode: ${res.data}`)
          let subCount = Object.entries(pl.getSubscriptions()).length
          assert.equal(subCount, 1)
        })
        .catch((error) => {
          console.error("error")
          let subCount = Object.entries(pl.getSubscriptions()).length
          assert.equal(subCount, 1)
        })

          let isJSON = () => {
              try {
                  JSON.parse(subMessage)
              } catch (e) {
                  return false
              }
              return true
          }
          assert(isJSON(), true)
      } finally {
          //done()
      }
  })
})
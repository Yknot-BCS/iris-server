const { MessageRouter, MessageSubscription, PostListener } = require('./index')
const axios = require('axios')

//let mr = new MessageRouter()
let pl = new PostListener()

/*let testSubscription = MessageSubscription.actionSubscription('stablecoin.z', 'transfer', function (message) {
    console.log(`ACTION - eosio.token::issue message - ${JSON.stringify(message, null, 4)}`)
})

let testSubscriptionNewAccount = MessageSubscription.actionSubscription('eosio', 'newaccount', function (message) {
    console.log(`ACTION - eosio.token::newaccount message - ${message.trace.act.data.name}`)
})

let testSubscriptionTransfer = MessageSubscription.transferSubscription('qwertyqwerty', function (message) {
    console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})
let testSubscriptionTransfer2 = MessageSubscription.transferSubscription('zartknissuer', function (message) {
  console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})

//mr.subscribe(testSubscription)
//mr.subscribe(testSubscriptionNewAccount)
mr.subscribe(testSubscriptionTransfer)
mr.subscribe(testSubscriptionTransfer2)*/

let testSubscription = MessageSubscription.actionSubscription('stablecoin.z', 'transfer', function (message) {
  //console.log(`ACTION - eosio.token::issue message - ${JSON.stringify(message, null, 4)}`)
  axios.post('http://127.0.0.1:8080/sub',  message )
  .then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
    //console.log(res)
  })
  .catch((error) => {
    console.error("error")
  })
})

let testSubscriptionTransfer = MessageSubscription.transferSubscription('zartknissuer', function (message) {
  console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
  let chain_id = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'

  let payload = `chainId=${chain_id}&transactionId=${message.trx_id}`;
  
  axios.post(`https://walletapi.coolx.io/api/v2/Message?${payload}`,  "")
  .then((res) => {
    console.log(res.status + " " + res.statusText)
  })
  .catch((error) => {
    console.error(error)
  })
})

/*axios.post('http://127.0.0.1:8080/addSubscritpion',  'zartknissuer' )
  .then((res) => {
    //console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch((error) => {
    console.error("error")
  })*/
//mr.subscribe(testSubscription)
//mr.subscribe(testSubscriptionTransfer)

//mr.start()
pl.start()
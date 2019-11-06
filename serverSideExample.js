const { MessageRouter, MessageSubscription } = require('./index')

let mr = new MessageRouter()


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

let testSubscription = MessageSubscription.actionSubscription('eosio.token', 'transfer', function (message) {
  //console.log(`ACTION - eosio.token::transfer message - ${JSON.stringify(message, null, 4)}`)
})

let testSubscriptionTransfer = MessageSubscription.transferSubscription('zartknissuer', function (message) {
  //console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})

mr.subscribe(testSubscription)
mr.subscribe(testSubscriptionTransfer)
mr.start()

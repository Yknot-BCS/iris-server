const { PostListener } = require('./index')
const axios = require('axios')

let pl = new PostListener()

var coolxAccounts = [
  "acornaccount",
  "eosio.token",
  "greencointls",
  "ourbmstokens",
  "qubicletoken",
  "revelation21",
  "stablecarbon",
  "stablecoin.z",
  "stablecoinro",
  "telosdacdrop"
]

axios.post('http://history.telos.africa:3000/unsubscribe',  { channel: '2', topic: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
   
  })
  .catch((error) => {
    console.error(error)
   
  })

/*axios.post('http://history.telos.africa:3000/addSubscription',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error(error)
  })*/

  /*axios.post('http://127.0.0.1:8080/addSubscriptionList',  { accounts: coolxAccounts } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error("error")
  })

  axios.post('http://127.0.0.1:8080/addSubscription',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
  })
  .catch((error) => {
    console.error("error")
    
  })

  axios.post('http://10.0.0.85:3000/addSubscription',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error(error)
  })*/



  /*axios.post('http://127.0.0.1:8080/unsubscribe',  { channel: '2', topic: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    pl.getSubscriptions()
    
  })
  .catch((error) => {
    console.error("error")
   
  })*/
pl.jwtSign()

pl.start()


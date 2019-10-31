const { PostListener } = require('./index')
const axios = require('axios')

//let pl = new PostListener()

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

axios.post('http://127.0.0.1:8080/addSubscritpion',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error(error)
  })

  axios.post('http://127.0.0.1:8080/addSubscritpionList',  { accounts: coolxAccounts } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error("error")
  })

  axios.post('http://127.0.0.1:8080/addSubscritpion',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
  })
  .catch((error) => {
    console.error("error")
    
  })

  axios.post('http://10.0.0.85:3000/addSubscritpion',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error(error)
  })



  /*axios.post('http://127.0.0.1:8080/unsubscribe',  { channel: '2', topic: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    pl.getSubscriptions()
    
  })
  .catch((error) => {
    console.error("error")
   
  })*/

//pl.start()


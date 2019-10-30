const express = require('express')
const bodyParser = require("body-parser")
const MessageRouter = require('../routing/MessageRouter')
const MessageSubscription = require('../routing/MessageSubscription')
const axios = require('axios')


class PostListener {

  constructor(port = 8080) {
    console.log("PostListener constructor called")
      this.app = express();
      this.app.use(bodyParser.urlencoded({extended: false}))
      this.app.use(bodyParser.json())
      this.port = port
      this.mr = new MessageRouter()
      this.chain_id = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
  }

  start() {
    console.log(`Start webserver, ${this.port}`)
    this.app.listen(this.port)
    this.app.post("/addSubscritpion", this.addSubscritpion.bind(this))
    this.app.post("/addSubscritpionList", this.addSubscritpionList.bind(this))
    this.mr.start()
    //this.app.post("/sub2", this.handlePost.bind(this))
  }

  subscribe(account){
    console.log(`subscribe account: ${account}`)
    let subscriptionTransfer = MessageSubscription.transferSubscription(account,this.handler.bind(this))
    this.mr.subscribe(subscriptionTransfer)
  }

  addSubscritpion(req, resp) {
    this.subscribe(req.body.account)
    resp.end("OK")
  }

  addSubscritpionList(req, resp) {
    let accounts = req.body.accounts
    accounts.forEach(data => this.subscribe(data));
    resp.end("OK")
  }

  handler(message) {
    console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
    let payload = `chainId=${this.chain_id}&transactionId=${message.trx_id}`;
  
    axios.post(`https://walletapi.coolx.io/api/v2/Message?${payload}`,  "")
    .then((res) => {
      console.log(res.status + " " + res.statusText)
    })
    .catch((error) => {
      console.error(error)
    })

  }

  handlePost(req, resp) {
    //console.log(req.body)
    //console.log(resp)
    console.log("here")
    resp.end("OK")
  }

}
module.exports = PostListener
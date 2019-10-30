const express = require('express')
const bodyParser = require("body-parser")
const MessageRouter = require('../routing/MessageRouter')
const MessageSubscription = require('../routing/MessageSubscription')
const axios = require('axios')


class PostListener {

  constructor(chronicleport = 8800,  webport = 8080) {
    console.log("PostListener constructor called")
      this.app = express();
      this.server = this.app.listen(this.port)
      this.app.use(bodyParser.urlencoded({extended: false}))
      this.app.use(bodyParser.json())
      this.port = webport
      this.mr = new MessageRouter(chronicleport)
      this.chain_id = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
      this.subscriptions = {}
  }

  start() {
    console.log(`Start webserver, ${this.port}`)
    this.app.post("/addSubscritpion", this.addSubscritpion.bind(this))
    this.app.post("/addSubscritpionList", this.addSubscritpionList.bind(this))
    this.app.post("/unsubscribe", this.unsubscribe.bind(this))
    this.mr.start()
    //this.app.post("/sub2", this.handlePost.bind(this))
  }

  stop() {
    this.server.close(()=>{console.log('Process terminated')});
  }

  subscribe(subscription) {
    if (!subscription.isValid()) {
        console.error(`Invalid subscription: ${JSON.stringify(subscription)}`)
        return
    }

    let channel = subscription.getChannel()
    let topic = subscription.getTopic()
    let alreadySubscribed = true
    if (!this.subscriptions.hasOwnProperty(channel)) {
        this.subscriptions[channel] = {}
        alreadySubscribed = false
    }

    if (!this.subscriptions[channel].hasOwnProperty(topic)) {
        this.subscriptions[channel][topic] = subscription
        alreadySubscribed = false
    }

    if (alreadySubscribed)
        throw new Error(`Already a subscription for channel ${channel} with topic ${topic}`)

    this.mr.subscribe(subscription)

    console.log(`Sent subscription request for channel ${channel} and topic ${topic}`)
}

  subscribeRegister(account){
    console.log(`subscribe account: ${account}`)
    let subscriptionTransfer = MessageSubscription.transferSubscription(account,this.handler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  addSubscritpion(req, resp) {
    this.subscribeRegister(req.body.account)
    resp.end("200")
  }

  addSubscritpionList(req, resp) {
    let accounts = req.body.accounts
    accounts.forEach(data => this.subscribeRegister(data));
    resp.end("200")
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

  unsubscribe(req, resp) {
    let { channel, topic } = req.body
    let subscription = this.getSubscription(channel, topic)
    resp.end("200")

    delete this.subscriptions[channel][topic]
    this.mr.unsubscribe(subscription)   
  }


  getSubscription(channel, topic) {
    return this.subscriptions[channel][topic]
  }

  getSubscriptions() {
    console.log(this.subscriptions)
  }

}
module.exports = PostListener
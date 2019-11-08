const express = require('express')
const bodyParser = require("body-parser")
const MessageRouter = require('../routing/MessageRouter')
const MessageSubscription = require('../routing/MessageSubscription')
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

class PostListener {

  constructor(chronicleport = 8800,  webport = 8080) {
      this.app = express();
      console.log(`Start webserver, ${webport}`)
      this.server = this.app.listen(webport)
      this.app.use(bodyParser.urlencoded({extended: false}))
      this.app.use(bodyParser.json())

      this.mr = new MessageRouter(chronicleport)
      this.chain_id = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
      this.subscriptions = {}
  }

  start() {
    
    this.app.post("/addSubscription", this.addSubscription.bind(this))
    this.app.post("/addSubscriptionList", this.addSubscriptionList.bind(this))
    this.app.post("/unsubscribe", this.unsubscribe.bind(this))
    this.mr.start()
    this.getSubsFile()
    //this.app.post("/sub2", this.handlePost.bind(this))
  }

  stop() {
    this.server.close(()=>{console.log('Process terminated')});
  }

  jwtSign() {
    let privPath = path.join(__dirname, '..', 'keys', 'jwtRS256.key');
    let privateKEY  = fs.readFileSync(privPath, 'utf8');
    //let publicKEY  = fs.readFileSync('./public.key', 'utf8');
    /*
    ====================   JWT Signing =====================
    */
    let payload = {
        "block_num": "354",
        "account" : "qwertyqwerty",
        "action" : "transfer",
        "data": {
            "from": "crp.tf",
            "to": "eosio.stake",
            "quantity": "1.0000 TLOS",
            "memo": "stake bandwidth"
        },
        "trx_id": "626bc95581d3f9c444535f3bbdc8663662d6c3dd9d95127b92f85ee141b10a46",
        "block_time": "2019-11-01T00:00:02.000"
    }

    let i  = 'eZAR Corp'   
    let s  = 'admin@ezar.co.za'  
    let a  = 'https://ezar.co.za'
    let signOptions = {
      issuer:  i,
      subject:  s,
      audience:  a,
      expiresIn:  "1h",
      algorithm:  "RS512"   // RSASSA [ "RS256", "RS384", "RS512" ]
    }
    let token = jwt.sign(payload, privateKEY, signOptions)
    console.log("Token :" + token)
    this.jwtVerify(token)

  }

  jwtVerify(token) {
    let pubPath = path.join(__dirname, '..', 'keys', 'jwtRS256.key.pub');
    let publicKEY  = fs.readFileSync(pubPath, 'utf8');
    /*
    ====================   JWT Verify =====================
    */
    let i  = 'eZAR Corp'   
    let s  = 'admin@ezar.co.za'  
    let a  = 'https://ezar.co.za'
    const verifyOptions = {
      issuer:  i,
      subject:  s,
      audience:  a,
      expiresIn:  "1h",
      algorithm:  ["RS512"]
    };
    let legit = jwt.verify(token, publicKEY, verifyOptions);
    console.log("\nJWT verification result:\n" + JSON.stringify(legit));
  }

  getSubsFile(){
    //let channels = require('../subs.json')
    let jsonPath = path.join(__dirname, '..', 'sub_data', 'subs.json');
    fs.readFile(jsonPath, (err, data) => {
      if (err) throw err;
      let channels = JSON.parse(data);
          
      for(var channel in channels) {
        let channelSubscriptions = channels[channel]
        for(var topic in channelSubscriptions)
        {
            let subData = JSON.parse(channelSubscriptions[topic])
            let channel = subData.channel
            let account = subData.topic
            switch (channel)
            {
              case 1:
                let data = account.split("::")
                this.subscribeAction(data[0], data[1])
                break
              case 2:
                this.subscribeTransfer(account)
                break
              default:
                  // code block
            }

        }
      }
    });
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

  subscribeAction(contract, action){
    console.log(`subscribe contract: ${contract}, subscribe action: ${action}`)
    let subscriptionTransfer = MessageSubscription.actionSubscription(contract, action,this.handler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  subscribeTransfer(account){
    console.log(`subscribe account: ${account}`)
    let subscriptionTransfer = MessageSubscription.transferSubscription(account,this.handler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  addSubscription(req, resp) {
    this.subscribeTransfer(req.body.account)
    resp.end("200")
  }

  addSubscriptionList(req, resp) {
    let accounts = req.body.accounts
    accounts.forEach(data => this.subscribeTransfer(data));
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
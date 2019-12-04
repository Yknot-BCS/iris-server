const fs   = require('fs');
const jwt   = require('jsonwebtoken');
const path = require('path');


// use 'utf8' to get string instead of byte array  (512 bit key)

let privPath = path.join(__dirname, '..', 'keys', 'jwtRS256.key');
let privateKEY  = fs.readFileSync(privPath, 'utf8');

let pubPath = path.join(__dirname, '..', 'keys', 'jwtRS256.key.pub');
let publicKEY  = fs.readFileSync(pubPath, 'utf8');


class JWTService {
  constructor() {
  
  }

  sign(payload){
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

    /*let payload = {
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
    }*/

    let token = jwt.sign(payload, privateKEY, signOptions)
    return token
  }

  verify(token){
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
    try{
      return jwt.verify(token, publicKEY, verifyOptions);
    }catch (err){
      return false;
    }
  }

  decode(token){
    //Returns the decoded token without verifying, return null if it fails
    return jwt.decode(token, {complete: true});
  }
}

module.exports = JWTService
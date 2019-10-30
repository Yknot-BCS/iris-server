// TODO: get ports from process args?
// TODO: test that this can be ran from command line easily/directly now that it's the default export of index.js,
// maybe need a new file to run, think about easiest way for a sysadmin to run this, they should be able to 
// configure ports without creating a javascript file

//const MessageRouter = require('../routing/MessageRouter')
const { PostListener } = require('../index')
const optionsDef = require('./IrisOptions')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const options = commandLineArgs(optionsDef.opts)

if (options.help) {
    const usage = commandLineUsage(optionsDef.usage)
    console.log(usage)
    process.exit(1)
}

const chronicleListenerPort = options['chronicle-port']
const webport = isNaN(options['web-port']) ? 8080 : options['web-port']
//const clientListenerPort = isNaN(options['web-port']) ? 8880 : options['web-port']
//let mr = new MessageRouter(chronicleListenerPort)
//mr.start()
let pl = new PostListener(chronicleListenerPort, webport)
pl.start()

process.once('SIGINT', function (code) {
    console.log('\nSIGINT received...');
    pl.stop();
});

process.once('SIGTERM', function (code) {
    console.log('\nSIGTERM received...');
    pl.stop();
});

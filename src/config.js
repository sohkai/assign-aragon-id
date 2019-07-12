const Web3 = require('web3')
const homedir = require('homedir')
const path = require('path')
const { acceptedNetworks } = require('./network')

const ACCEPTED_NAMES = /^([\w-]+)$/

const configFilePath = (filename) =>
  path.join(homedir(), `.aragon/${filename}`)

const getLocalKeyConfig = (network) =>
  require(configFilePath(`${network}_key.json`))

module.exports = (help) => {
  // First two args are node and name of script
  const [network, orgAddress, name, gasPrice] = process.argv.slice(2, 6).map(arg => arg.toLowerCase())

  if (!acceptedNetworks.includes(network)) {
    console.error(`Error: specified network '${network}' is not one of ${acceptedNetworks.join(', ')}.`)
    console.log()
    help()
    process.exit(0)
  }

  if (!Web3.utils.isAddress(orgAddress)) {
    console.error(`Error: specified organization address ${orgAddress}' is not a valid address.`)
    console.log()
    help()
    process.exit(0)
  }

  if (!ACCEPTED_NAMES.test(name)) {
    console.error(`Error: specified aragonID name '${name}' is not a valid ENS subnode. Characters must conform to [0-9a-z].`)
    console.log()
    help()
    process.exit(0)
  }

  if (gasPrice) {
    try {
      Web3.utils.toWei(gasPrice, 'gwei')
    } catch (err) {
      console.error(`Error: specified gas price '${gasPrice}' is not an integer in wei.`)
      help()
      process.exit(0)
    }
  }

  let keys
  try {
    keys = getLocalKeyConfig(network).keys
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('Missing keys')
    }
  } catch (err) {
    console.error(
      `Error: local private key configuration for '${network}' was not set up correctly. Please visit https://hack.aragon.org/docs/guides-faq#set-a-private-key to see how to set it up.`
    )
    process.exit(0)
  }

  return { gasPrice, keys, name, network, orgAddress }
}

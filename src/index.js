const ENS = require('ethereum-ens')
const Web3 = require('web3')
const registrarAbi = require('@aragon/id/build/contracts/IFIFSResolvingRegistrar').abi
const parseArgs = require('./config')
const { acceptedNetworks, networkConfigMap } = require('./network')

function help() {
  console.log('Usage: npm run assign:id -- <network> <organization address> <aragonID name> <gas price in gwei (optional, default 10)>')
  console.log()
  console.log(`  - network: must be one of ${acceptedNetworks.map(network => `'${network}'`).join(', ')}`)
}

async function main() {
  // Check vars, local config
  const { gasPrice, keys, name, network, orgAddress } = parseArgs(help)
  const networkConfig = networkConfigMap[network]

  console.log()
  console.log(`Registering ${name}.aragonid.eth for ${orgAddress} on network '${network}'...`)

  const [privKey] = keys
  if (keys.length > 1) {
    console.log(`Using the first private key defined in '${network}_key.json'...`)
  }
  console.log()

  const web3 = new Web3(networkConfig.node)
  const ens = new ENS(web3.currentProvider, networkConfig.ensRegistry)

  // Check name doesn't already exist
  try {
    const exists = await ens.resolver(`${name}.aragonid.eth`).addr()
    if (exists) {
      console.log(`Cannot assign: ${name}.aragonid.eth is already assigned to ${exists}.`)
      return
    }
  } catch (err) {
    // All good, name does not exist yet
  }

  // Add account to web3
  const account = web3.eth.accounts.privateKeyToAccount(privKey.startsWith('0x') ? privKey : `0x${privKey}`)
  web3.eth.accounts.wallet.add(account)

  const registrar = new web3.eth.Contract(registrarAbi, networkConfig.aragonIdRegistry)
  const receipt = await registrar.methods.register(Web3.utils.sha3(name), orgAddress).send({
    from: account.address,
    gas: '1000000',
    gasPrice: gasPrice || Web3.utils.toWei('10', 'gwei'),
  })
  const { transactionHash: txHash } = receipt

  console.log(`Registered with transaction: ${txHash}.`)
  console.log(`Visit ${network}.etherscan.io/tx/${txHash} to view progress.`)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed with', err)
    process.exit(1)
  })

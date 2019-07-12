const acceptedNetworks = ['mainnet', 'rinkeby']
const networkConfigMap = {
  mainnet: {
    ensRegistry: '0x314159265dd8dbb310642f98f50c066173c1259b',
    aragonIdRegistry: '0x546aa2eae2514494eeadb7bbb35243348983c59d',
    node: 'wss://mainnet.eth.aragon.network/ws',
  },
  rinkeby: {
    ensRegistry: '0x98df287b6c145399aaa709692c8d308357bc085d',
    aragonIdRegistry: '0x3665e7bfd4d3254ae7796779800f5b603c43c60d',
    node: 'wss://rinkeby.eth.aragon.network/ws',
  },
}

module.exports = {
  acceptedNetworks,
  networkConfigMap,
}

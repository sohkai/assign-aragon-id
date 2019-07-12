# Assign an Aragon ID

I guess you've deployed an organization but want to set it up so it can be resolved via `rinkeby.aragon.org/#/<name>` instead of `rinkeby.aragon.org/#/0x<address>`?

Let's find out how!

> Note that you may have varying success on Mainnet and should not be used with accounts you'd like to keep secure.

## Steps

1. Know which network your organization was deployed on (e.g. Rinkeby or Mainnet)
1. Set up a `~/.<network>_key.json` file ([see instructions](https://hack.aragon.org/docs/guides-faq#set-a-private-key))
1. Install node.js 8+
1. Clone this repo, do an `npm install` inside of it
1. Pick out a name, that conforms to what's allowed with a ENS sub node (e.g. `[0-9a-z]`)
1. Run `npm run assign:id -- <network> <organization address> <aragonID name> <gas price in gwei (optional)>`

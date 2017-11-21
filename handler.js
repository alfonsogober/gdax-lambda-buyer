const Gdax = require('./gdax-node')
const authedClient = new Gdax.AuthenticatedClient(process.env.GDAX_API_KEY, process.env.GDAX_API_SECRET, process.env.GDAX_PASSPHRASE, process.env.GDAX_URI)

export const buyBitcoin = async (event, context, callback) => {
  try {
    let order = await buy('BTC')
    console.log(order)
    succeed(context)
  } catch (err) {
    fail(context, err)
  }
}

export const buyEthereum = async (event, context, callback) => {
  try {
    let order = await buy('ETH')
    console.log(order)
    succeed(context)
  } catch (err) {
    fail(context, err)
  }
}

export const buyLitecoin = async (event, context, callback) => {
  try {
    let order = await buy('LTC')
    console.log(order)
    succeed(context)
  } catch (err) {
    fail(context, err)
  }
}

async function buy (cryptoType) {
  let params = {
    'product_id': `${cryptoType}-${process.env.FIAT_TYPE}`
  }
  if (process.env.FIAT_AMOUNT || process.env.CRYPTO_AMOUNT) {
    params.type = 'market'
    if (process.env.FIAT_AMOUNT) params.funds = process.env.FIAT_AMOUNT / 3
    else if (process.env.CRYPTO_AMOUNT) params.size = process.env.CRYPTO_AMOUNT / 3
    return authedClient.buy(params)
  } else throw new Error('Must specify either FIAT_AMOUNT or CRYPTO_AMOUNT')
}

function succeed (context) {
  context.succeed({ statusCode: 200 })
}

function fail (context, err) {
  console.log(err)
  context.fail(err)
}

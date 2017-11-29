const Gdax = require('./gdax-node')
const _ = require('lodash')
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

export const deposit = async (event, context, callback) => {
  try {
    let paymentMethod = _.find(await authedClient.getPaymentMethods(), { primary_buy: true })
    if (paymentMethod) {
      let deposit = await authedClient.depositToPaymentMethod({
        amount: process.env.DAILY_DEPOSIT,
        currency: process.env.FIAT_TYPE,
        'payment_method_id': paymentMethod.id
      })
      console.log(deposit)
      succeed(context)
    } else fail(context, new Error('No Payment ID'))
  } catch (err) {
    fail(context, err)
  }
}

async function buy (cryptoType) {
  let params = {
    'product_id': `${cryptoType}-${process.env.FIAT_TYPE}`
  }
  if (process.env.DAILY_DEPOSIT || process.env.CRYPTO_AMOUNT) {
    params.type = 'market'
    if (process.env.DAILY_DEPOSIT) params.funds = ((process.env.DAILY_DEPOSIT / 24) / 3).toPrecision(2)
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

const Gdax = require('gdax')
const authedClient = new Gdax.AuthenticatedClient(process.env.GDAX_API_KEY, process.env.GDAX_API_SECRET, process.env.GDAX_PASSPHRASE, process.env.GDAX_URI)

export const buy = async (event, context, callback) => {
  try {
    let params = {
      'product_id': `${process.env.CRYPTO_TYPE}-${process.env.FIAT_TYPE}`
    }
    if (process.env.FIAT_AMOUNT || process.env.CRYPTO_AMOUNT) {
      params.type = 'market'
      if (process.env.FIAT_AMOUNT) params.funds = process.env.FIAT_AMOUNT
      else if (process.env.CRYPTO_AMOUNT) params.size = process.env.CRYPTO_AMOUNT
      let order = await authedClient.buy(params)
      console.log(order)
      succeed(context)
    } else fail(context, new Error('Must specify either FIAT_AMOUNT or CRYPTO_AMOUNT'))
  } catch (err) {
    fail(context, err)
  }
}

function succeed (context) {
  context.succeed({ statusCode: 200 })
}

function fail (context, err) {
  console.log(err)
  context.fail(err)
}

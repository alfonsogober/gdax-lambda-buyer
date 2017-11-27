const Gdax = require('./gdax-node')
const authedClient = new Gdax.AuthenticatedClient(process.env.GDAX_API_KEY, process.env.GDAX_API_SECRET, process.env.GDAX_PASSPHRASE, process.env.GDAX_URI)

export const deposit = async (event, context, callback) => {
  try {
    let deposit = await depositFromBank()
    console.log(deposit)
    succeed(context)
  } catch (err) {
    fail(context, err)
  }
}

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

async function depositFromBank() {
  if (process.env.DEPOSIT_AMOUNT) {
    try {
      let paymentMethodsResponse = await paymentMethods();
      for (var i = 0; i < paymentMethodsResponse.length; i++) {
        if (paymentMethodsResponse[i].currency == process.env.FIAT_TYPE && paymentMethodsResponse[i].type == 'ach_bank_account') {
          var paymentMethodId = paymentMethodsResponse[i].id
        }
      }

      const depositParams = {
        'amount': process.env.DEPOSIT_AMOUNT,
        'currency': process.env.FIAT_TYPE,
        'payment_method_id': paymentMethodId
      }
      return authedClient.depositPaymentMethod(depositParams)
    } catch (err) {
      console.log(err)
    }
  } else throw new Error('Must specify DEPOSIT_AMOUNT')

}

async function paymentMethods() {
  return authedClient.getPaymentMethods();
}

async function buy(cryptoType) {
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

function succeed(context) {
  context.succeed({
    statusCode: 200
  })
}

function fail(context, err) {
  console.log(err)
  context.fail(err)
}

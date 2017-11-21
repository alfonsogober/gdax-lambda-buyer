# GDAX Lambda Buyer

A Lambda function for recurring cryptocurrency purchases.

## Table of Contents

* [Who Needs This?](#who-needs-this)
* [Getting Started](#who-needs-this)
* [API Keys](#api-keys)
* [Adjust Parameters](#adjust-parameters)
* [One-Time Buys](#one-time-buys)
* [Test](#test)
* [Deploy](#deploy)
* [Disclaimer](#disclaimer)

## Who needs this?

If you have a Coinbase account and don't want to pay the 1.5% fee for buys, you can use GDAX (they're owned by the same company so you already have a GDAX account if you're on Coinbase) instead and schedule your recurring crypto buys using the GDAX API + AWS Lambda. GDAX fees are a much-nicer .25%. Pretty sweet.

## Getting Started

Make sure you have [Serverless](https://serverless.com/framework/docs/providers/aws/guide/installation/) installed and your [AWS credentials are set up](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

Next, clone the repo and install dependencies.

```
git clone git@github.com:alfonsogoberjr/gdax-lambda-buyer.git
cd gdax-lambda-buyer && yarn
```

### API Keys

If you haven't already, make sure you create [Sandbox](https://public.sandbox.gdax.com/settings/api) (if you want to test buy with fake money) and [Production](https://www.gdax.com/settings/api) GDAX API keys. You will need to log in to both the Sandbox and Production versions of GDAX, located at https://public.sandbox.gdax.com and https://gdax.com, respectively.

If you plan to use Sandbox money (not real fiat currency), you will also need to "deposit" by going to the Sandbox site at https://public.sandbox.gdax.com/trade/BTC-USD and clicking "Deposit" > "Coinbase Account". There should be a fake USD wallet pre-populated for you with some money. Specity the amount of fake money you want to deposit and click "Deposit funds".

If you only plan to use real money (USD/EUR), you only need to deposit funds on the real GDAX site.

Next, create a file called `credentials.json` with the following contents:

```
{
  "dev": {
    "gdaxURI": "https://api-public.sandbox.gdax.com",
    "gdaxPassphrase": "your-sandbox-passphrase",
    "gdaxAPIKey": "your-sandbox-api-key",
    "gdaxAPISecret": "your-sandbox-secret"
  },
  "prod": {
    "gdaxURI": "https://api.gdax.com",
    "gdaxPassphrase": "your-prod-passphrase",
    "gdaxAPIKey": "your-prod-api-key",
    "gdaxAPISecret": "your-prod-secret"
  }
}
```

Save and close. This file is listed in .gitignore so you don't have to worry about accidentally checking it in to Git.

### Adjust Parameters

Take a look at `serverless.yml`. The relevant sections are listed below.

```
...

  environment:
    ...
    FIAT_AMOUNT: 15       # The amount of fiat you wish to exchange for crypto
    FIAT_TYPE: 'USD'      # The type of fiat you plan to use. Also supports EUR/GBP
...

functions:
  buyBitcoin:
    handler: handler.buyBitcoin
    events:
      - schedule: rate(7 days) # Change this to your liking.
  buyEthereum:
    handler: handler.buyEthereum
    events:
      - schedule: rate(7 days) # Change this to your liking.
  buyLitecoin:
    handler: handler.buyLitecoin
    events:
      - schedule: rate(7 days) # Change this to your liking.

...

```

So with the default settings, gdax-lambda-buyer will buy $5 worth of Bitcoin, Ethereum and Litecoin (totaling $15 spent) every week.

You can also replace `FIAT_AMOUNT=15` with `CRYPTO_AMOUNT=3` and buy 1 BTC, ETH and LTC each every week. Change to 100 and you'd buy 33.333 each, etc. The possibilities are endless (as long as your bank account is 💸).

Note that ETH and LTC are supported in prod, but not in the sandbox for some reason. So stick to BTC if you're using sandbox money.

## One-Time Buys

You don't have to deploy at all, if you just want a quick way to purchase all three cryptocurrencies at once, you can run

```
yarn run all
```

and the function will run with your settings immediately.

Also supports `yarn run btc`, `yarn run eth` and `yarn run ltc`, which will only purchase 1/3 of your `FIAT_AMOUNT` each.

Deploying is only necessary for the recurring buy feature.

## Test

If you want to test the function with sandbox money, run

```
yarn test
```

to verify that all works as expected.

## Deploy

```
yarn run deploy
```

will deploy your scheduled Lambda functions to production, which will run on your specified schedule.

## Disclaimer

Please note:

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT  
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO  
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER  
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE  
USE OR OTHER DEALINGS IN THE SOFTWARE.
```

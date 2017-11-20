# GDAX Lambda Buyer

A Lambda function for recurring cryptocurrency purchases.

## Table of Contents

* [Who Needs This?](#who-needs-this)
* [Getting Started](#who-needs-this)
* [API Keys](#api-keys)
* [Adjust Parameters](#adjust-parameters)
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
    FIAT_AMOUNT: 10       # The amount of fiat you wish to exchange for crypto
    FIAT_TYPE: 'USD'      # The type of fiat you plan to use. Also supports EUR/GBP
    CRYPTO_TYPE: 'BTC'    # The type of cryptocurrency you wish to buy.
...

functions:
  buy:
    handler: handler.buy
    events:
      - schedule: rate(7 days) # Change this to your liking.

...

```

So with the default settings, gdax-lambda-buyer will buy $10 worth of Bitcoin every week.

You can also replace `FIAT_AMOUNT=10` with `CRYPTO_AMOUNT=0.1` and buy 0.1 BTC every week. Change to 100 and you'd buy 100, etc. The possibilities are endless (as long as your bank account is 💸).

Note that ETH and LTC are supported in prod, but not in the sandbox for some reason. So stick to BTC if you're using sandbox money.

## Test

You don't have to deploy at all, if you just want a quick way to purchase, say, $10 worth of BTC you can run

```
yarn run test-prod
```

and the function will run with your settings immediately.

Deploying is only necessary for the recurring buy feature.

## Deploy

```
yarn run deploy
```

will deploy your scheduled Lambda function to production, which will run on your specified schedule.

## Disclaimer

Please note:

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

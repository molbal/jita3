const Binance = require('binance-api-node');
require('dotenv').config();


// Replace these with your own API keys
const client = Binance({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
});

// Set up the MACD and RSI indicators
const MACD = require('technicalindicators').MACD;
const RSI = require('technicalindicators').RSI;

const macdInput = {
  values: [],
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  SimpleMAOscillator: false,
  SimpleMASignal: false
};

const rsiInput = {
  period: 14,
  values: []
};

// Function to execute a trade
async function executeTrade(symbol, tradeType, quantity) {
  try {
    // Check if we have enough balance to place the trade
    const balance = await client.accountInfo({});
    const symbolBalance = balance.balances.find(b => b.asset === symbol);
    if (parseFloat(symbolBalance.free) < parseFloat(quantity)) {
      console.log(`Not enough ${symbol} balance to place trade`);
      return;
    }

    // Place the trade
    const order = await client.order({
      symbol: `${symbol}BTC`,
      side: tradeType,
      type: 'MARKET',
      quantity: quantity
    });
    console.log(`Trade executed: ${tradeType} ${quantity} ${symbol} at market price`);
  } catch (error) {
    console.error(error);
  }
}

// Function to check if the MACD and RSI indicate a trade opportunity
async function checkIndicators(symbol, price) {
  // Remove extra items from the macdInput and rsiInput arrays
  if (macdInput.values.length > 500) {
    macdInput.values = macdInput.values.slice(macdInput.values.length - 500);
  }
  if (rsiInput.values.length > 500) {
    rsiInput.values = rsiInput.values.slice(rsiInput.values.length - 500);
  }

  // Add the latest price to the input arrays for the MACD and RSI indicators
  macdInput.values.push(price);
  rsiInput.values.push(price);

  // If we don't have enough data yet, don't do anything
  if (macdInput.values.length < macdInput.slowPeriod) return;

  // Calculate the MACD and RSI
  const macdResult = MACD.calculate(macdInput);
  const rsiResult = RSI.calculate(rsiInput);

  // Check if the MACD and RSI are indicating a trade opportunity
  if (macdResult && rsiResult) {
    const macd = macdResult[macdResult.length - 1];
    const rsi = rsiResult[rsiResult.length - 1];

    if (macd.histogram > 0 && rsi > 70) {
      // MACD is positive and RSI is overbought, so sell
      await executeTrade(symbol, 'SELL', process.env.AMOUNT);
    } else if (macd.histogram < 0 && rsi < 30) {
      // MACD is negative and RSI is oversold, so buy
      await executeTrade(symbol, 'BUY', process.env.AMOUNT);
    }
  }
}


function checkEnvVars() {
  const requiredVars = ['API_KEY', 'API_SECRET', 'SYMBOL', 'AMOUNT'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
}


checkEnvVars();

// Connect to the Binance WebSocket for the ticker stream
client.ws.ticker(process.env.SYMBOL, ticker => {
  // Get the latest ticker price
  const price = parseFloat(ticker.bestAsk);

  // Check the indicators for trade opportunities
  checkIndicators(symbol, price);
});

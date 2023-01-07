# Binance Trading Bot

This is a simple trading bot that uses the [Binance API](https://binance-docs.github.io/apidocs/spot/en/#introduction) and the [technicalindicators](https://www.npmjs.com/package/technicalindicators) library to implement a momentum scalping strategy based on the MACD and RSI indicators. The bot listens for updates to the ticker price using the Binance WebSocket API and executes trades for a specified amount of units of the symbol when the MACD histogram and RSI indicate a trade opportunity.

## Prerequisites

*   [Node.js](https://nodejs.org/)
*   A [Binance API key and secret](https://www.binance.com/en/support/articles/360002502072)

## Usage

To run the bot in a Docker container, you will need to have Docker installed. Then, build the Docker image by running the following command in the project root directory:

  docker build -t jita3 .

To run the image in a container, use the following command:

  docker run -d --name jita3 -e API\_KEY=your-api-key -e API\_SECRET=your-api-secret -e SYMBOL=ETH -e AMOUNT=0.01 jita3

This will run the `jita3` image in a container in detached mode (\`-d\`). The \`--name\` flag specifies the name of the container as \`jita3\`. The \`-e\` flag is used to set the following container environment variables:

*   `API_KEY`: Your Binance API key
*   `API_SECRET`: Your Binance API secret
*   `SYMBOL`: The symbol that the bot should trade (e.g. \`ETH\`)
*   `AMOUNT`: The amount of units to trade each opportunity (e.g. \`0.01\`)

The bot will connect to the Binance WebSocket for the specified symbol and listen for updates to the ticker price. When the ticker updates with a new best ask price, the bot will calculate the MACD and RSI indicators and check if they are indicating a trade opportunity. If they are, the bot will execute a trade for the specified amount of units of the symbol.

## MACD and RSI Indicators

The Moving Average Convergence Divergence (MACD) indicator is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price. It is calculated by subtracting the 26-day exponential moving average (EMA) from the 12-day EMA. A 9-day EMA of the MACD, called the "signal line," is then plotted on top of the MACD, which can function as a trigger for buy and sell signals.

The Relative Strength Index (RSI) is a momentum indicator that measures the magnitude of recent price changes to evaluate overbought or oversold conditions in the price of a stock or other asset. The RSI ranges from 0 to 100, with high and low levels marked at 70 and 30, respectively. Traditionally, RSI is considered overbought when above 70 and oversold when below 30. Signals can also be generated by looking for divergences, failure swings, and centerline crossovers.

The output of the MACD and RSI indicators can be interpreted as follows:

*   If the MACD histogram is positive and the RSI is overbought (above 70), this may indicate a sell opportunity.
*   If the MACD histogram is negative and the RSI is oversold (below 30), this may indicate a buy opportunity.

## Note

This is not meant for production usage, just a learning experience.
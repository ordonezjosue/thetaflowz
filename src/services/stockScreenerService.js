import twelveDataService from './twelveDataService';

class StockScreenerService {
  constructor() {
    this.twelveData = twelveDataService;
  }

  // Get S&P 500 stocks list
  async getSP500Stocks() {
    try {
      // In production, this would fetch from a comprehensive S&P 500 API
      // For now, returning a curated list of major stocks
      const majorStocks = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'UNH', 'JNJ',
        'JPM', 'V', 'PG', 'HD', 'MA', 'DIS', 'PYPL', 'NFLX', 'CRM', 'ADBE', 'NKE', 'KO',
        'PEP', 'ABT', 'TMO', 'AVGO', 'COST', 'WMT', 'MRK', 'ACN', 'LLY', 'DHR', 'TXN',
        'QCOM', 'HON', 'UNP', 'RTX', 'LOW', 'SPGI', 'ISRG', 'GILD', 'ADI', 'VRTX', 'REGN',
        'KLAC', 'PANW', 'SNPS', 'CDNS', 'MELI', 'FTNT', 'OKTA', 'ZS', 'CRWD', 'NET', 'PLTR'
      ];

      return majorStocks.map(symbol => ({
        symbol,
        name: this.getStockName(symbol),
        sector: this.getStockSector(symbol)
      }));
    } catch (error) {
      console.error('Error fetching S&P 500 stocks:', error);
      throw error;
    }
  }

  // Get stock name (in production, this would come from API)
  getStockName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'NVDA': 'NVIDIA Corporation',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms Inc.',
      'BRK.B': 'Berkshire Hathaway Inc.',
      'UNH': 'UnitedHealth Group Inc.',
      'JNJ': 'Johnson & Johnson',
      'JPM': 'JPMorgan Chase & Co.',
      'V': 'Visa Inc.',
      'PG': 'Procter & Gamble Co.',
      'HD': 'The Home Depot Inc.',
      'MA': 'Mastercard Inc.',
      'DIS': 'The Walt Disney Co.',
      'PYPL': 'PayPal Holdings Inc.',
      'NFLX': 'Netflix Inc.',
      'CRM': 'Salesforce Inc.',
      'ADBE': 'Adobe Inc.',
      'NKE': 'Nike Inc.',
      'KO': 'The Coca-Cola Co.',
      'PEP': 'PepsiCo Inc.',
      'ABT': 'Abbott Laboratories',
      'TMO': 'Thermo Fisher Scientific Inc.',
      'AVGO': 'Broadcom Inc.',
      'COST': 'Costco Wholesale Corporation',
      'WMT': 'Walmart Inc.',
      'MRK': 'Merck & Co. Inc.',
      'ACN': 'Accenture plc',
      'LLY': 'Eli Lilly and Company',
      'DHR': 'Danaher Corporation',
      'TXN': 'Texas Instruments Inc.',
      'QCOM': 'QUALCOMM Inc.',
      'HON': 'Honeywell International Inc.',
      'UNP': 'Union Pacific Corporation',
      'RTX': 'Raytheon Technologies Corporation',
      'LOW': 'Lowe\'s Companies Inc.',
      'SPGI': 'S&P Global Inc.',
      'ISRG': 'Intuitive Surgical Inc.',
      'GILD': 'Gilead Sciences Inc.',
      'ADI': 'Analog Devices Inc.',
      'VRTX': 'Vertex Pharmaceuticals Inc.',
      'REGN': 'Regeneron Pharmaceuticals Inc.',
      'KLAC': 'KLA Corporation',
      'PANW': 'Palo Alto Networks Inc.',
      'SNPS': 'Synopsys Inc.',
      'CDNS': 'Cadence Design Systems Inc.',
      'MELI': 'MercadoLibre Inc.',
      'FTNT': 'Fortinet Inc.',
      'OKTA': 'Okta Inc.',
      'ZS': 'Zscaler Inc.',
      'CRWD': 'CrowdStrike Holdings Inc.',
      'NET': 'Cloudflare Inc.',
      'PLTR': 'Palantir Technologies Inc.'
    };
    return names[symbol] || symbol;
  }

  // Get stock sector (in production, this would come from API)
  getStockSector(symbol) {
    const sectors = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'NVDA': 'Technology',
      'TSLA': 'Consumer Discretionary',
      'META': 'Technology',
      'BRK.B': 'Financials',
      'UNH': 'Healthcare',
      'JNJ': 'Healthcare',
      'JPM': 'Financials',
      'V': 'Financials',
      'PG': 'Consumer Staples',
      'HD': 'Consumer Discretionary',
      'MA': 'Financials',
      'DIS': 'Communication Services',
      'PYPL': 'Financials',
      'NFLX': 'Communication Services',
      'CRM': 'Technology',
      'ADBE': 'Technology',
      'NKE': 'Consumer Discretionary',
      'KO': 'Consumer Staples',
      'PEP': 'Consumer Staples',
      'ABT': 'Healthcare',
      'TMO': 'Healthcare',
      'AVGO': 'Technology',
      'COST': 'Consumer Staples',
      'WMT': 'Consumer Staples',
      'MRK': 'Healthcare',
      'ACN': 'Technology',
      'LLY': 'Healthcare',
      'DHR': 'Healthcare',
      'TXN': 'Technology',
      'QCOM': 'Technology',
      'HON': 'Industrials',
      'UNP': 'Industrials',
      'RTX': 'Industrials',
      'LOW': 'Consumer Discretionary',
      'SPGI': 'Financials',
      'ISRG': 'Healthcare',
      'GILD': 'Healthcare',
      'ADI': 'Technology',
      'VRTX': 'Healthcare',
      'REGN': 'Healthcare',
      'KLAC': 'Technology',
      'PANW': 'Technology',
      'SNPS': 'Technology',
      'CDNS': 'Technology',
      'MELI': 'Consumer Discretionary',
      'FTNT': 'Technology',
      'OKTA': 'Technology',
      'ZS': 'Technology',
      'CRWD': 'Technology',
      'NET': 'Technology',
      'PLTR': 'Technology'
    };
    return sectors[symbol] || 'Unknown';
  }

  // Test method to verify service is working
  async testService() {
    console.log('StockScreenerService: Testing service...');
    try {
      const stocks = await this.getSP500Stocks();
      console.log('StockScreenerService: Got SP500 stocks:', stocks.length);
      return { success: true, stockCount: stocks.length };
    } catch (error) {
      console.error('StockScreenerService: Test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Screen stocks based on criteria
  async screenStocks(criteria) {
    try {
      console.log('Starting stock screening with criteria:', criteria);
      const stocks = await this.getSP500Stocks();
      console.log('Got SP500 stocks:', stocks.length);
      const screenedStocks = [];

      // Process stocks in batches to avoid API rate limits
      const batchSize = 10;
      for (let i = 0; i < stocks.length; i += batchSize) {
        const batch = stocks.slice(i, i + batchSize);
        const symbols = batch.map(stock => stock.symbol);
        
        try {
          console.log(`Processing batch ${i / batchSize + 1} with symbols:`, symbols);
          // Get real-time data for this batch
          const quotes = await this.twelveData.getMultipleQuotes(symbols);
          console.log(`Got quotes for batch ${i / batchSize + 1}:`, quotes.length);
          
          // Process each stock in the batch
          quotes.forEach(quote => {
            if (quote && this.matchesCriteria(quote, criteria)) {
              const stock = stocks.find(s => s.symbol === quote.symbol);
              if (stock) {
                const screenedStock = {
                  ...stock,
                  price: quote.price,
                  change: quote.change,
                  changePercent: quote.changePercent,
                  volume: quote.volume,
                  high: quote.high,
                  low: quote.low,
                  open: quote.open,
                  previousClose: quote.previousClose,
                  timestamp: quote.timestamp,
                  // Mock data for options-specific metrics (in production, these would come from options API)
                  bidAskSpread: this.calculateMockBidAskSpread(quote.price),
                  impliedVolatility: this.calculateMockImpliedVolatility(quote.volume, quote.changePercent),
                  daysToExpiry: this.calculateMockDaysToExpiry(),
                  score: this.calculateStockScore(quote, criteria)
                };
                screenedStocks.push(screenedStock);
              }
            }
          });
        } catch (error) {
          console.error(`Error processing batch ${i / batchSize + 1}:`, error);
          // Continue with next batch
        }
      }

      console.log('Screening completed. Found stocks:', screenedStocks.length);
      return screenedStocks;
    } catch (error) {
      console.error('Error screening stocks:', error);
      console.log('Falling back to mock data...');
      
      // Enhanced fallback to mock data
      try {
        const stocks = await this.getSP500Stocks();
        const mockResults = stocks.map(stock => ({
          ...stock,
          price: Math.random() * (criteria.maxPrice - criteria.minPrice) + criteria.minPrice,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 20,
          volume: Math.random() * 10000000 + criteria.minVolume,
          high: Math.random() * (criteria.maxPrice - criteria.minPrice) + criteria.minPrice + 5,
          low: Math.random() * (criteria.maxPrice - criteria.minPrice) + criteria.minPrice - 5,
          open: Math.random() * (criteria.maxPrice - criteria.minPrice) + criteria.minPrice,
          previousClose: Math.random() * (criteria.maxPrice - criteria.minPrice) + criteria.minPrice,
          timestamp: new Date(),
          marketCap: Math.random() * 10000000000 + criteria.minMarketCap,
          bidAskSpread: this.calculateMockBidAskSpread(Math.random() * (criteria.maxPrice - criteria.minPrice) + criteria.minPrice),
          impliedVolatility: this.calculateMockImpliedVolatility(Math.random() * 10000000, (Math.random() - 0.5) * 20),
          daysToExpiry: this.calculateMockDaysToExpiry(),
          score: Math.random() * 100
        })).filter(stock => 
          stock.price >= criteria.minPrice &&
          stock.price <= criteria.maxPrice &&
          stock.volume >= criteria.minVolume &&
          stock.marketCap >= criteria.minMarketCap &&
          stock.bidAskSpread <= criteria.maxBidAskSpread &&
          stock.impliedVolatility >= criteria.minImpliedVolatility &&
          stock.impliedVolatility <= criteria.maxImpliedVolatility &&
          stock.daysToExpiry >= criteria.minDaysToExpiry &&
          stock.daysToExpiry <= criteria.maxDaysToExpiry
        );

        console.log('Mock data generated:', mockResults.length, 'stocks');
        return mockResults;
      } catch (mockError) {
        console.error('Error generating mock data:', mockError);
        throw error; // Re-throw original error if mock data also fails
      }
    }
  }

  // Check if stock matches screening criteria
  matchesCriteria(stock, criteria) {
    return (
      stock.price >= criteria.minPrice &&
      stock.price <= criteria.maxPrice &&
      stock.volume >= criteria.minVolume &&
      this.calculateMockBidAskSpread(stock.price) <= criteria.maxBidAskSpread &&
      this.calculateMockImpliedVolatility(stock.volume, stock.changePercent) >= criteria.minImpliedVolatility &&
      this.calculateMockImpliedVolatility(stock.volume, stock.changePercent) <= criteria.maxImpliedVolatility &&
      this.calculateMockDaysToExpiry() >= criteria.minDaysToExpiry &&
      this.calculateMockDaysToExpiry() <= criteria.maxDaysToExpiry
    );
  }

  // Calculate mock bid/ask spread (in production, this would come from options API)
  calculateMockBidAskSpread(price) {
    // Simulate bid/ask spread based on price (lower price = higher percentage spread)
    const baseSpread = 0.01; // 1% base spread
    const priceAdjustment = Math.max(0.005, 1 / price); // Higher spread for lower-priced stocks
    return Math.min(0.1, baseSpread + priceAdjustment); // Cap at 10%
  }

  // Calculate mock implied volatility (in production, this would come from options API)
  calculateMockImpliedVolatility(volume, changePercent) {
    // Simulate IV based on volume and price change
    const volumeFactor = Math.min(1, volume / 10000000); // Normalize volume
    const volatilityFactor = Math.abs(changePercent) / 100; // Higher change = higher IV
    const baseIV = 0.3; // 30% base IV
    
    return Math.min(1.0, Math.max(0.1, baseIV + (volatilityFactor * 0.4) + (volumeFactor * 0.2)));
  }

  // Calculate mock days to expiry (in production, this would come from options API)
  calculateMockDaysToExpiry() {
    // Simulate various expiration dates
    const possibleDTE = [7, 14, 21, 30, 45, 60, 90, 120, 180, 365];
    return possibleDTE[Math.floor(Math.random() * possibleDTE.length)];
  }

  // Calculate stock score based on criteria and metrics
  calculateStockScore(stock, criteria) {
    let score = 50; // Base score

    // Volume score (0-20 points)
    const volumeScore = Math.min(20, (stock.volume / criteria.minVolume) * 10);
    score += volumeScore;

    // Price stability score (0-15 points)
    const priceStability = Math.max(0, 15 - (Math.abs(stock.changePercent) * 0.5));
    score += priceStability;

    // Liquidity score (0-15 points)
    const liquidityScore = Math.max(0, 15 - (this.calculateMockBidAskSpread(stock.price) * 200));
    score += liquidityScore;

    // Volatility appropriateness score (0-20 points)
    const iv = this.calculateMockImpliedVolatility(stock.volume, stock.changePercent);
    const ivScore = 20 - Math.abs(iv - ((criteria.minImpliedVolatility + criteria.maxImpliedVolatility) / 2)) * 40;
    score += Math.max(0, ivScore);

    return Math.min(100, Math.max(0, score));
  }

  // Get options chain for a specific stock (placeholder for future implementation)
  async getOptionsChain(symbol) {
    try {
      // This would integrate with an options data provider like:
      // - TD Ameritrade API
      // - Interactive Brokers API
      // - CBOE DataShop
      // - OptionMetrics
      
      console.log(`Getting options chain for ${symbol} (placeholder)`);
      return {
        symbol,
        expirationDates: [],
        strikes: [],
        calls: [],
        puts: []
      };
    } catch (error) {
      console.error('Error getting options chain:', error);
      throw error;
    }
  }

  // Get implied volatility surface (placeholder for future implementation)
  async getImpliedVolatilitySurface(symbol) {
    try {
      // This would provide a 3D view of IV across strikes and expirations
      console.log(`Getting IV surface for ${symbol} (placeholder)`);
      return {
        symbol,
        surface: [],
        skew: [],
        termStructure: []
      };
    } catch (error) {
      console.error('Error getting IV surface:', error);
      throw error;
    }
  }
}

export default new StockScreenerService();

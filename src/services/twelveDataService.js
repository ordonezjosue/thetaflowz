const API_KEY = process.env.REACT_APP_TWELVEDATA_API_KEY;
const BASE_URL = process.env.REACT_APP_TWELVEDATA_BASE_URL;

class TwelveDataService {
  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = BASE_URL;
  }

  // Get real-time stock quote
  async getStockQuote(symbol) {
    try {
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if API returned an error
      if (data.status === 'error') {
        throw new Error(data.message || 'API error occurred');
      }
      
      return {
        symbol: data.symbol,
        price: parseFloat(data.close),
        change: parseFloat(data.change),
        changePercent: parseFloat(data.percent_change),
        volume: parseInt(data.volume),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        open: parseFloat(data.open),
        previousClose: parseFloat(data.previous_close),
        timestamp: new Date(data.timestamp)
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw error;
    }
  }

  // Get multiple stock quotes
  async getMultipleQuotes(symbols) {
    try {
      console.log('TwelveData API: Attempting to fetch quotes for symbols:', symbols);
      console.log('TwelveData API: Base URL:', this.baseUrl);
      console.log('TwelveData API: API Key exists:', !!this.apiKey);
      
      if (!this.apiKey) {
        throw new Error('API key is missing. Please set REACT_APP_TWELVEDATA_API_KEY environment variable.');
      }
      
      if (!this.baseUrl) {
        throw new Error('Base URL is missing. Please set REACT_APP_TWELVEDATA_BASE_URL environment variable.');
      }
      
      const symbolList = symbols.join(',');
      const url = `${this.baseUrl}/quote?symbol=${symbolList}&apikey=${this.apiKey}`;
      console.log('TwelveData API: Requesting URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TwelveData API: Response not OK:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('TwelveData API: Raw response data:', data);
      
      // Check if API returned an error
      if (data.status === 'error') {
        console.error('TwelveData API: API returned error:', data);
        throw new Error(data.message || 'API error occurred');
      }
      
      // Handle both single and multiple results
      const quotes = Array.isArray(data) ? data : [data];
      console.log('TwelveData API: Processed quotes:', quotes.length);
      
      return quotes.map(quote => ({
        symbol: quote.symbol,
        price: parseFloat(quote.close),
        change: parseFloat(quote.change),
        changePercent: parseFloat(quote.percent_change),
        volume: parseInt(quote.volume),
        high: parseFloat(quote.high),
        low: parseFloat(quote.low),
        open: parseFloat(quote.open),
        previousClose: parseFloat(quote.previous_close),
        timestamp: new Date(quote.timestamp)
      }));
    } catch (error) {
      console.error('TwelveData API: Error fetching multiple quotes:', error);
      throw error;
    }
  }

  // Get basic market overview (S&P 500, NASDAQ, DOW)
  async getMarketOverview() {
    try {
      const symbols = ['SPY', 'QQQ', 'DIA']; // S&P 500, NASDAQ, DOW ETFs
      const quotes = await this.getMultipleQuotes(symbols);
      
      return {
        sp500: quotes.find(q => q.symbol === 'SPY'),
        nasdaq: quotes.find(q => q.symbol === 'QQQ'),
        dow: quotes.find(q => q.symbol === 'DIA'),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      throw error;
    }
  }

  // Check API status and remaining requests
  async checkApiStatus() {
    try {
      const response = await fetch(
        `${this.baseUrl}/usage?apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API status check failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking API status:', error);
      throw error;
    }
  }
}

export default new TwelveDataService();

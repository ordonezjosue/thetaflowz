# Stock Screener Setup Guide

## Issue: Stock Screener Not Showing Results

The stock screener is currently not showing results because it's missing the required API configuration for real-time market data.

## Root Cause

The application is trying to fetch real-time stock data from the TwelveData API, but the required environment variables are not set:
- `REACT_APP_TWELVEDATA_API_KEY` - Your API key from TwelveData
- `REACT_APP_TWELVEDATA_BASE_URL` - The API base URL

## Solutions

### Option 1: Set Up Real API (Recommended)

1. **Get a TwelveData API Key:**
   - Visit [https://twelvedata.com/](https://twelvedata.com/)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Create Environment File:**
   - Copy `env.example` to `.env` in your project root
   - Replace `your_api_key_here` with your actual API key

3. **Restart the Application:**
   - Stop the current server (Ctrl+C)
   - Run `npm start` again

### Option 2: Use Mock Data (Current Fallback)

The screener will automatically fall back to mock data if the API fails. This means:
- ✅ You'll see results immediately
- ✅ No API key required
- ❌ Data is not real-time
- ❌ Limited to sample S&P 500 stocks

## Current Status

- **API Status:** ❌ Not configured
- **Fallback Data:** ✅ Available
- **Real-time Updates:** ❌ Not available

## Debugging

Open your browser's Developer Console (F12) and look for:
- API error messages
- Mock data generation logs
- Stock screening progress

## Expected Behavior

1. **With API Key:** Real-time stock data, live updates
2. **Without API Key:** Mock data, sample results, error alerts

## Next Steps

1. Check the browser console for error messages
2. Set up your API key if you want real data
3. The screener should work with mock data even without an API key

## Support

If you continue to have issues:
1. Check the browser console for errors
2. Verify your `.env` file is in the project root
3. Ensure you've restarted the application after adding environment variables

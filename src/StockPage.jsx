// src/StockPage.js
import React, { useState, useEffect } from 'react';
import './StockPage.css';

function StockPage() {
  const [timeFrame, setTimeFrame] = useState('30');
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch - in a real app, you would call your API here
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData(selectedStock, parseInt(timeFrame));
      setStockData(mockData);
      setIsLoading(false);
    }, 500);
  }, [timeFrame, selectedStock]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
  };

  // Calculate average price
  const averagePrice = stockData.length > 0 
    ? (stockData.reduce((sum, point) => sum + point.price, 0) / stockData.length).toFixed(2)
    : 0;

  return (
    <div className="stock-page">
      <h2>Stock Price Chart</h2>
      
      <div className="controls">
        <div className="control-group">
          <label>Stock: </label>
          <select value={selectedStock} onChange={handleStockChange}>
            <option value="AAPL">Apple (AAPL)</option>
            <option value="GOOGL">Google (GOOGL)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
            <option value="AMZN">Amazon (AMZN)</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Time Frame (minutes): </label>
          <select value={timeFrame} onChange={handleTimeFrameChange}>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="120">120</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <div className="chart-container">
          {/* In a real app, you would use a charting library like Chart.js or Recharts here */}
          <div className="mock-chart">
            {stockData.map((point, index) => (
              <div 
                key={index}
                className="chart-bar"
                style={{ height: `${(point.price / 200) * 100}%` }}
                title={`Price: $${point.price.toFixed(2)}\nTime: ${point.time}`}
              ></div>
            ))}
            <div className="average-line" style={{ bottom: `${(averagePrice / 200) * 100}%` }}>
              <span>Average: ${averagePrice}</span>
            </div>
          </div>
          <div className="chart-labels">
            {stockData.map((point, index) => (
              <span key={index}>{point.time}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock data
function generateMockData(stockSymbol, minutes) {
  const data = [];
  const basePrice = {
    AAPL: 150,
    GOOGL: 2500,
    MSFT: 300,
    AMZN: 3500
  }[stockSymbol] || 150;

  for (let i = minutes; i >= 0; i--) {
    const time = i === 0 ? 'Now' : `${i}m ago`;
    const price = basePrice + (Math.random() * 20 - 10);
    data.push({ time, price });
  }

  return data;
}

export default StockPage;
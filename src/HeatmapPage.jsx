// src/HeatmapPage.js
import React, { useState, useEffect } from 'react';
import './HeatmapPage.css';

function HeatmapPage() {
  const [timeFrame, setTimeFrame] = useState('30');
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredStock, setHoveredStock] = useState(null);

  const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NFLX'];

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHeatmapData(generateMockHeatmapData(stocks, parseInt(timeFrame)));
      setIsLoading(false);
    }, 500);
  }, [timeFrame]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const handleStockHover = (stock) => {
    setHoveredStock(stock);
  };

  return (
    <div className="heatmap-page">
      <h2>Correlation Heatmap</h2>
      
      <div className="controls">
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
        <div className="heatmap-container">
          <div className="heatmap">
            {/* Row labels */}
            <div className="row-labels">
              {stocks.map(stock => (
                <div 
                  key={stock}
                  className="label"
                  onMouseEnter={() => handleStockHover(stock)}
                  onMouseLeave={() => handleStockHover(null)}
                >
                  {stock}
                </div>
              ))}
            </div>
            
            {/* Heatmap cells */}
            <div className="heatmap-grid">
              {stocks.map(rowStock => (
                <div key={rowStock} className="heatmap-row">
                  {stocks.map(colStock => {
                    const correlation = heatmapData[rowStock][colStock];
                    const colorIntensity = Math.abs(correlation) * 255;
                    const color = correlation > 0 
                      ? `rgb(0, ${colorIntensity}, 0)` 
                      : `rgb(${colorIntensity}, 0, 0)`;
                    
                    return (
                      <div 
                        key={`${rowStock}-${colStock}`}
                        className="heatmap-cell"
                        style={{ backgroundColor: color }}
                        title={`${rowStock} vs ${colStock}: ${correlation.toFixed(2)}`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Column labels */}
            <div className="col-labels">
              {stocks.map(stock => (
                <div 
                  key={stock}
                  className="label"
                  onMouseEnter={() => handleStockHover(stock)}
                  onMouseLeave={() => handleStockHover(null)}
                >
                  {stock}
                </div>
              ))}
            </div>
          </div>
          
          {/* Color legend */}
          <div className="legend">
            <span>Strong Negative</span>
            <div className="legend-gradient"></div>
            <span>Strong Positive</span>
          </div>
          
          {/* Stock stats */}
          {hoveredStock && (
            <div className="stock-stats">
              <h3>{hoveredStock}</h3>
              <p>Average Price: ${(Math.random() * 1000 + 100).toFixed(2)}</p>
              <p>Standard Deviation: ${(Math.random() * 50).toFixed(2)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock heatmap data
function generateMockHeatmapData(stocks, minutes) {
  const data = {};
  
  stocks.forEach(stock1 => {
    data[stock1] = {};
    stocks.forEach(stock2 => {
      if (stock1 === stock2) {
        data[stock1][stock2] = 1; // Perfect correlation with itself
      } else {
        // Random correlation between -1 and 1
        data[stock1][stock2] = Math.random() * 2 - 1;
      }
    });
  });
  
  return data;
}

export default HeatmapPage;
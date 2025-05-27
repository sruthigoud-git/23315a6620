import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress, Select, MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';


const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  textTransform: 'none',
}));

const ErrorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
}));

function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4MzI5MTc2LCJpYXQiOjE3NDgzMjg4NzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImViMTIyZGIwLTc4YjAtNDliMS1hMDYwLWQwNTQ2YmMyYmQ1OSIsInN1YiI6IjIzMzE1YTY2MjBAYWltbC5zcmVlbmlkaGkuZWR1LmluIn0sImVtYWlsIjoiMjMzMTVhNjYyMEBhaW1sLnNyZWVuaWRoaS5lZHUuaW4iLCJuYW1lIjoic3J1dGhpIiwicm9sbE5vIjoiMjMzMTVhNjYyMCIsImFjY2Vzc0NvZGUiOiJQQ3FBVUsiLCJjbGllbnRJRCI6ImViMTIyZGIwLTc4YjAtNDliMS1hMDYwLWQwNTQ2YmMyYmQ1OSIsImNsaWVudFNlY3JldCI6InB1TXJGemNNWFRLalpzSmcifQ.2SIiobkphsPU-IP052kiOZoM99zWNAfucBMA6QfWAKo" 
  const api = axios.create({
    baseURL: 'http://20.244.56.144/evaluation-service',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        console.log("Fetching stocks...");
        const response = await api.get('/stocks');

        console.log("Raw /stocks response:", response.data);

        let stockList = [];

        if (response.data) {
          if (Array.isArray(response.data)) {
            stockList = response.data;
          } else if (response.data.stocks && typeof response.data.stocks === 'object') {
            stockList = Object.entries(response.data.stocks).map(([name, symbol]) => ({
              name,
              symbol
            }));
          } else if (typeof response.data === 'object') {
            stockList = Object.entries(response.data).map(([name, symbol]) => ({
              name,
              symbol
            }));
          }
        }

        if (stockList.length === 0) {
          console.warn("No stocks found in response:", response.data);
        }

        setStocks(stockList);
      } catch (err) {
        setError('Failed to fetch stocks. ' + (err.response?.data?.message || err.message));
        console.error("Error fetching /stocks:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const fetchCurrentPrice = async () => {
    if (!selectedStock) return;
    try {
      setLoading(true);
      const response = await api.get(`/stocks/${selectedStock}`);
      console.log("Current price response:", response.data);
      
      // Handle different response formats
      const priceData = response.data.stock || response.data;
      if (!priceData || !priceData.price) {
        throw new Error('Invalid price data received');
      }
      
      setCurrentPrice(priceData);
    } catch (err) {
      setError('Failed to fetch current price. ' + (err.response?.data?.message || err.message));
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    if (!selectedStock || !minutes) return;
    try {
      setLoading(true);
      const response = await api.get(`/stocks/${selectedStock}/minutes=${minutes}`);
      console.log("History response:", response.data);

      let history = [];
      
  
      if (Array.isArray(response.data)) {
        history = response.data;
      } else if (response.data.history) {
        history = response.data.history;
      } else if (typeof response.data === 'object') {
        history = [response.data];
      }

      if (history.length === 0) {
        throw new Error('No history data received');
      }

      setPriceHistory(history);

      // Calculate average price
      const validPrices = history.filter(item => typeof item.price === 'number');
      if (validPrices.length > 0) {
        const avg = validPrices.reduce((sum, h) => sum + h.price, 0) / validPrices.length;
        setAveragePrice(avg);
      } else {
        setAveragePrice(null);
      }
    } catch (err) {
      setError('Failed to fetch price history. ' + (err.response?.data?.message || err.message));
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    fetchCurrentPrice();
    fetchPriceHistory();
  };

  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
    setCurrentPrice(null);
    setPriceHistory([]);
    setAveragePrice(null);
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Stock Exchange Dashboard
      </Typography>

      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Select
              value={selectedStock}
              onChange={handleStockChange}
              displayEmpty
              fullWidth
              variant="outlined"
              sx={{ minWidth: 200 }}
              renderValue={(selected) => selected || "Select a stock"}
            >
              <MenuItem value="" disabled>
                Select a stock
              </MenuItem>
              {stocks.map((stock, idx) => (
                <MenuItem key={idx} value={stock.symbol}>
                  {stock.name} ({stock.symbol})
                </MenuItem>
              ))}
            </Select>

            <TextField
              type="number"
              label="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
              variant="outlined"
              sx={{ width: 120 }}
              inputProps={{ min: 1 }}
            />

            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!selectedStock || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Loading...' : 'Get Data'}
            </StyledButton>
          </Box>
        </form>
      </StyledPaper>

      {error && (
        <ErrorPaper elevation={3}>
          <Typography variant="body1">{error}</Typography>
        </ErrorPaper>
      )}

      {currentPrice && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Current Price for {selectedStock}
          </Typography>
          <Typography variant="body1">
            <Box component="span" sx={{ fontWeight: 'bold' }}>Price:</Box> ${currentPrice.price.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <Box component="span" sx={{ fontWeight: 'bold' }}>Last Updated:</Box> {new Date(currentPrice.lastUpdatedAt).toLocaleString()}
          </Typography>
        </StyledPaper>
      )}

      {averagePrice !== null && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Average Price Calculation
          </Typography>
          <Typography variant="body1">
            <Box component="span" sx={{ fontWeight: 'bold' }}>Average price</Box> over last {minutes} minutes: ${averagePrice.toFixed(2)}
          </Typography>
        </StyledPaper>
      )}

      {priceHistory.length > 0 && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Price History (Last {minutes} minutes)
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priceHistory.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>${item.price?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell>
                      {item.lastUpdatedAt ? new Date(item.lastUpdatedAt).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>
      )}
    </StyledContainer>
  );
}

export default App;

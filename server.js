const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 42111;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get game state
app.get('/api/gameState', (req, res) => {
  res.json(req.session.gameState || {});
});

// Endpoint to save game state
app.post('/api/gameState', (req, res) => {
  req.session.gameState = req.body;
  res.sendStatus(200);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at 0.0.0.0:42111`);
  });
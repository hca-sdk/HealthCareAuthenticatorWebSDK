const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.use("/", express.static(path.join(__dirname, "/public")));

// Set up a route for ignore-index.html.
app.get(/\/(index.html)?$/, function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/dashboard(\.html)?', function (req, res) {
  res.sendFile(path.join(__dirname + '/dashboard.html'));
});

app.get('/expired-link', function (req, res) {
  res.sendFile(path.join(__dirname + '/expired-link.html'));
});

// Start the server.
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
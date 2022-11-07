const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.use("/src", express.static(path.join(__dirname, "src")));

// Set up a route for ignore-index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/ignore-index.html'));
});

// Start the server.
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
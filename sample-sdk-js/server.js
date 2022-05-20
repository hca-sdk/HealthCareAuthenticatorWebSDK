const express = require('express');
const path = require('path');
const app = express();
const port = 4200;

app.use("/src", express.static(path.join(__dirname, "src")));

// Set up a route for index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

// Start the server.
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
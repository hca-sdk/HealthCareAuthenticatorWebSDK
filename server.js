const express = require('express');
const path = require('path');
const app = express();
const port = 4500;

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/src", express.static(path.join(__dirname, "/sample-sdk-js/src")));


// Set up a route for index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/sample-sdk-js/src/index.html'));
});

// Start the server.
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
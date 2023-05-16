const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Define name file path to the JSON file
const namefilepath = path.join(__dirname, "names.json");

// Define a route to return a random names
app.get("/names", (req, res) => {
  // Read the content of the JSON file
  fs.readFile(namefilepath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
      return;
    }
    const jsonData = JSON.parse(data);

    // Access the names array
    const names = jsonData.names;

    // Generate a random index to select a random name
    const randomIndex = Math.floor(Math.random() * names.length);

    // Return the selected name as the response
    res.send(names[randomIndex]);
  });
});

// Define a route for the homepage
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Random Name Generater API</title>
      </head>
      <body>
        <h1>Typing Test API</h1>
        <p>To use this API, make a GET request to the <code>/names</code> endpoint. The response will be a random name in json formet. </p>
      </body>
    </html>
  `);
});

// Middleware for handling undefined routes and unsupported HTTP methods
app.use((req, res, next) => {
  // If the request method is not GET
  if (req.method !== "GET") {
    const error = new Error("Method not allowed");
    error.status = 405;
    next(error);
    return;
  }
  // If the route is not defined
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, "error.html"));
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

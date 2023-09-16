var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");

var app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Close the server if there is an uncaught exception
app.use((req, res, next) => {
  // Create a domain for this request
  var domain = require("domain").create();

  // Handle error on this domain
  domain.on("error", (err) => {
    console.log("DOMAIN ERROR CAUGHT \n", err.stack);
    try {
      // Failsafe shutdown in 5 seconds
      setTimeout(() => {
        console.error("Failsafe shutdown");
        process.exit(1);
      }, 5000);

      // Disconnect from the server
      var worker = require("cluster").worker;
      if (worker) {
        worker.disconnect();
      }

      // Stop taking new requests
      server.close();

      try {
        // Attempt to use Express error route
        next(err);
      } catch (err) {
        // If Express error route failed, try plain Node response
        console.error("Express error mechanism failed \n", err.stack);
        res.statusCode = 500;
        res.setHeader("content-type", "text/plain");
        res.end("Server error");
      }
    } catch (err) {
      console.error("Unable to send 500 response.\n", err.stack);
    }
  });

  // Add the request and response objects to the domain
  domain.add(req);
  domain.add(res);

  // Execute the rest of the request chain in the domain
  domain.run(next);
});

var task = [];

// Handle request to root
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "./client/index.html");
//   res.end();
//   // res.setHeader("content-type", "text/plain");
//   // res.end("Home page");
// });

app.post("/", (req, res) => {
  task.push(req.body.task);
  console.log(task);
  res.redirect(303, "localhost:5500/client/index.html");
});

// Custom 404 page
app.use((req, res) => {
  res.statusCode = 404;
  res.setHeader("content-type", "text/plain");
  res.end("Error 404");
});

// Custom 500 page
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.setHeader("content-type", "text/plain");
  res.end("Server error");
});

app.listen(app.get("port"), () => {
  console.log(`Server started on https://localhost:${app.get("port")}`);
});

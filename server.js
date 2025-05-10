const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the dist directory
app.use(
  express.static(path.join(__dirname, "dist/fargo-msse663-angular-app/browser"))
);

// Send all requests to index.html
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "dist/fargo-msse663-angular-app/browser/index.html")
  );
});

// Start the app by listening on the default Railway port
const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

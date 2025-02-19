const express = require("express");
const path = require("path");
const env = require("dotenv").config();
const app = express();

// Serve static files from Views directory
app.use(express.static(path.join(__dirname, "Views")));

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "index.html"));
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running at`);
});

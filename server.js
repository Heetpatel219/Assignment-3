/*********************************************************************************
 * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 * Name: Devankit Shukla
 * Student ID: 139395222
 * Date: 20/02/2024
 *********************************************************************************/

// Import necessary modules
const express = require("express");
const legoData = require("./Modules/legoSets");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files from the public directory
app.use(express.static("public"));

// Routes

// Route to serve home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, './views/home.html'));
});

// Route to serve about page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, './views/about.html'));
});

// Route to handle retrieving Lego sets
app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  // Logic to retrieve Lego sets based on theme or all sets if no theme is specified
  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((sets) => {
        if (sets.length > 0) {
          res.json(sets);
        } else {
          res.status(404).send(`No LEGO sets found with theme: ${theme}`);
        }
      })
      .catch((error) => res.status(500).send(`Error: ${error}`));
  } else {
    legoData
      .getAllSets()
      .then((sets) => res.json(sets))
      .catch((error) => res.status(500).send(`Error: ${error}`));
  }
});

// Route to handle retrieving a specific Lego set by set number
app.get("/lego/sets/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .getSetByNum(setNum)
    .then((set) => {
      if (set) {
        res.json(set);
      } else {
        res.status(404).send("Lego set not found");
      }
    })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// Route to handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Initialize Lego data and start server
legoData
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      
    });
  })
  .catch((error) => {
    console.error(`Error initializing Lego data: ${error}`);
  });

  
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const tankRoutes = require("./routes/tankRoutes"); // Import tank routes
const terrainRoutes = require("./routes/terrainRoutes"); // Import terrain routes
const mapRoutes = require("./routes/mapRoutes"); // Import map routes
const simulationRoutes = require("./routes/simulationRoutes"); // Import simulation routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Middleware to set MIME type for ES modules
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript');

  }
  next();
});

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

// Middleware to make session data available to all EJS templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Authentication Routes
app.use(authRoutes);

// Tank Management Routes
app.use('/api/tanks', tankRoutes); // Use tank routes

// Terrain Management Routes
app.use('/api/terrains', terrainRoutes); // Use terrain routes

// Map Management Routes
app.use('/api/maps', mapRoutes); // Use map routes

// Simulation Routes
app.use(simulationRoutes); // Use simulation routes

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// Simulation Setup Page Route
app.get("/simulation-setup", (req, res) => {
  res.render("simulationSetup");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
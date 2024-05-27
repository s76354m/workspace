import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/authRoutes.js';
import tankRoutes from './routes/tankRoutes.js'; // Import tank routes
import terrainRoutes from './routes/terrainRoutes.js'; // Import terrain routes
import mapRoutes from './routes/mapRoutes.js'; // Import map routes
import simulationRoutes from './routes/simulationRoutes.js'; // Import simulation routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

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
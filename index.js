const mongoose = require("mongoose");
const routes1 = require("./userRoutes");
const routes2 = require("./blogRoutes");
const routes3 = require("./commentRoutes");  // Uncomment this line if needed
const routes4 = require("./likeRoutes");
const routes5 = require("./adminRoutes");
const passport = require('passport');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();

// Allow requests from any origin (or specify a domain)
app.use(cors({ origin: '*' }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API for Blog and User operations',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./userRoutes.js', './blogRoutes.js', './commentRoutes.js', './likeRoutes.js', './adminRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api', routes1);
app.use('/api', routes2);
app.use('/api', routes3);  // Add the comment routes
app.use('/api', routes4);
app.use('/api', routes5);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB and start the server
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb+srv://shemaroger:12345@cluster0.ksdq0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
      app.listen(5000, () => {
        console.log("Server has started on port 5000!");
        console.log('Swagger docs are available on http://localhost:5000/api-docs');
      });
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));
}

module.exports = app;  // Export the app for testing

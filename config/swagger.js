const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API ',
    version: '1.0.0',
    description: 'Detailed API documentation for the Express application, outlining the available endpoints and their usage.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api', // Update with your base URL
      description: 'Local development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };

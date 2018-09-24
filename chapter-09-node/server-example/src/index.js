const express = require('express');
const bodyParser = require('body-parser');
const loadAssets = require('./load-assets');
const assignRoutes = require('./assign-routes');

// If you preface the npm run start command with PORT=[Your Port] on
// macOS/Linux or set PORT=[Your Port] on Windows, it will change the port
// that the server is running on, so PORT=3001 will run the app on
// port 3001:
const PORT = process.env.PORT || 3000;

const startApp = async () => {
  const app = express();

  // Use body-parser for parsing JSON in the body of a request:
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Instantiate the Wasm module and local database:
  const assets = await loadAssets();

  // Setup routes that can interact with Wasm and the database:
  assignRoutes(app, assets);

  // Start the server with the specified port:
  app.listen(PORT, err => {
    if (err) return Promise.reject(err);
    return Promise.resolve();
  });
};

startApp()
  .then(() => console.log(`Server is running on port ${PORT}`))
  .catch(err => console.error(`An error occurred: ${err}`));

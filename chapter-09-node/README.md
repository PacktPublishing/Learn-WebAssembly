# Chapter 9: Integrating with Node.js

## Overview
The code within these folders represents the Node.js examples discussed in Chapter 9.

## Notes
- Unless otherwise specified, all terminal commands should be run from within their example folder (e.g. `/server-example`).

## Section Instructions
Each of the links below corresponds with a section of Chapter 9. Click to navigate to the section code.

- [Server Side WebAssembly with Express](#server-side-webassembly-with-express)
- [Client Side WebAssembly with Webpack](#client-side-webassembly-with-webpack)
- [Testing WebAssembly Modules with Jest](#testing-webassembly-modules-with-jest)

## Server Side WebAssembly with Express
Example Express application that utilizes a WebAssembly module. Ensure you `cd` into `/server-example` before running any commands.

### Installing the Dependencies
Run the following command to install the required dependencies:
```
npm install
```

### Building the Application
Run the following command to build:
```
npm run build
```

### Starting the Application
Run the following command to start the application:
```
npm start
```

### Testing Out the Application
Run the following command in a separate terminal instance (while application is running):
```
node ./requests.js 1
```

You should see the result of a `GET` call to the transactions endpoint. Consult the book or `requests.js` file for additional options.

## Client Side WebAssembly with Webpack
Example Webpack application that loads a C file using a Webpack loader. Ensure you `cd` into `/webpack-example` before running any commands.

### Installing the Dependencies
Run the following command to install the required dependencies:
```
npm install
```

### Building the Example
Run the following command to build:
```
npm run build
```

### Running the Example
Run the following command to start the example:
```
npm start
```

A browser window should open automatically and navigate to the example. Ensure what you see matches the book.

## Testing WebAssembly Modules with Jest
Example test configuration to test a WebAssembly module's exports using Jest. Ensure you `cd` into `/testing-example` before running any commands.

### Installing the Dependencies
Run the following command to install the required dependencies:
```
npm install
```

### Compiling the C File
Run the following command to compile the C file to a Wasm file:
```
npm run build
```

### Running the Tests
Run the following command to run the test suite:
```
npm test
```

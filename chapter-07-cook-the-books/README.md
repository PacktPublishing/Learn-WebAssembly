# Chapter 7: Creating an Application from Scratch

## Overview
The code within this folder represents the complete application, 'Cook the Books', built in Chapter 7.

## Notes
- Unless otherwise specified, all terminal commands should be run from within this folder.
- To remove existing built files, run the following command:
```
make clean
```

## Instructions
### Building the Application
Run the following command within this folder:
```
emcc lib/main.c -Os -s WASM=1 -s SIDE_MODULE=1 \
-s BINARYEN_ASYNC_COMPILATION=0 -o src/assets/main.wasm
```

Alternatively, you can run the following command:
```
make
```

### Running the Application
Run the following command to start the application:
```
npm start
```

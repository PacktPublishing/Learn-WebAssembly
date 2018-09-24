# Chapter 10: Advanced Tools and Upcoming Features

## Overview
The code within these folders represents the examples discussed in Chapter 10.

## Notes
- Unless otherwise specified, all terminal commands should be run from within their example folder (e.g. `/compile-with-llvm`).
- To remove existing built files, run the following command:
```
make clean
```

## Section Instructions
Each of the links below corresponds with a section of Chapter 10. Click to navigate to the section code.

- [Compiling with LLVM](#compiling-with-llvm)
- [Parallel Wasm with Web Workers](#parallel-wasm-with-web-workers)

## Compiling with LLVM
Describes how to compile C/C++ files using LLVM instead of Emscripten. Ensure you `cd` into `/compile-with-llvm` before running any commands.

### Installing the webassembly Package
Run the following command to install `webassembly` globally:
```
npm install -g webassembly
```

Once complete, ensure the installation was successful by running the following command:
```
wa
```

### Compiling the Example
Run the following command to compile the C++ file using LLVM:
```
wa compile main.cpp -o main.wasm
```

Alternatively, you can run the following command:
```
make
```

### Running the Example
Run the following command to start the example:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/index.html` and ensure what you see matches the book.

## Parallel Wasm with Web Workers
Example application that uses Web Workers. Ensure you `cd` into `/parallel-wasm` before running any commands.

### Installing the Dependencies
Run the following command to install the required dependencies:
```
npm install
```

### Building the Application
Run the following command to build:
```
emcc -Os -s WASM=1 -s SIDE_MODULE=1 -s BINARYEN_ASYNC_COMPILATION=0 lib/add.c -o src/calc-add.wasm \ 
&& emcc -Os -s WASM=1 -s SIDE_MODULE=1 -s BINARYEN_ASYNC_COMPILATION=0 lib/subtract.c -o src/calc-subtract.wasm
```

Alternatively, you can run the following command:
```
make
```

### Running the Application
Run the following command to start the application:
```
serve -l 8080 src
```

Navigate to `http://127.0.0.1:8080/index.html` and ensure what you see matches the book.

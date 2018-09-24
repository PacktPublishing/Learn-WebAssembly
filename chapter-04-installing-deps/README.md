# Chapter 4: Installing the Required Dependencies

## Overview
The purpose of this code is to test your Emscripten installation by compiling a C file.

## Notes
- Unless otherwise specified, all terminal commands should be run from within this folder.
- To remove existing built files, run the following command:
```
make clean
```

## Instructions
Run the following command within this folder:
```
emcc main.c -Os -s WASM=1 -s SIDE_MODULE=1 \
-s BINARYEN_ASYNC_COMPILATION=0 -o main.wasm
```

Alternatively, you can run the following command:
```
make
```

Check for the existence of `main.wasm` within the same folder. If present, the compilation was successful.

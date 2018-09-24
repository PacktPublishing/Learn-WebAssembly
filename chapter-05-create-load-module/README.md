# Chapter 5: Creating and Loading a WebAssembly Module

## Overview
The purpose of this code is to generate and load WebAssembly modules with and without Emscripten's JavaScript 'glue' code.

## Notes
- Unless otherwise specified, all terminal commands should be run from within this folder.
- To remove existing built files, run the following command:
```
make clean
```

## Section Instructions
Each of the links below corresponds with a section of Chapter 5. Click to navigate to the section code.

- [Compile and Load with Glue](#compile-and-load-with-glue)
- [Custom Loading Code](#custom-loading-code)
- [Try with Glue](#try-with-glue)
- [Compile and Load Without Glue](#compile-and-load-without-glue)

## Compile and Load with Glue
Run the following command within this folder:
```
emcc with-glue.c -O3 -s WASM=1 -s USE_SDL=2 -o with-glue.html
```

Alternatively, you can run the following command:
```
make with-glue
```

Run the following command within this folder:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/with-glue.html` and compare to book.

## Custom Loading Code
Run the following command within this folder:
```
emcc with-glue.c -O3 -s WASM=1 -s USE_SDL=2 -s MODULARIZE=1 -o custom-loading.js
```

Alternatively, you can run the following command:
```
make custom-loading
```

Run the following command within this folder:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/custom-loading.html` and compare to book.

## Try with Glue
Run the following command within this folder:
```
emcc with-glue.c -Os -s WASM=1 -s USE_SDL=2 -s SIDE_MODULE=1 \
-s BINARYEN_ASYNC_COMPILATION=0 -o try-with-glue.wasm
```

Alternatively, you can run the following command:
```
make try-with-glue
```

## Compile and Load Without Glue
Run the following command within this folder:
```
emcc without-glue.c -Os -s WASM=1 -s SIDE_MODULE=1 \
-s BINARYEN_ASYNC_COMPILATION=0 -o without-glue.wasm
```

Alternatively, you can run the following command:
```
make without-glue
```

Run the following command within the **root** folder:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/chapter-05-create-load-module/without-glue.html` and compare to book.

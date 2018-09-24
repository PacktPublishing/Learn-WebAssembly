# Chapter 6: Interacting with JavaScript and Debugging

## Overview
The purpose of this code is to demonstrate how to communicate between JavaScript and Wasm modules with and without Emscripten.

## Notes
- Unless otherwise specified, all terminal commands should be run from within this folder.
- To remove existing built files, run the following command:
```
make clean
```

## Section Instructions
Each of the links below corresponds with a section of Chapter 5. Click to navigate to the section code.

- [Interaction with Glue Code](#interaction-with-glue-code)
- [Interaction without Glue Code](#interaction-without-glue-code)
- [Using Source Maps](#using-source-maps)

## Interaction with Glue Code
Run the following command within this folder:
```
emcc js-with-glue.c -O3 -s WASM=1 -s MODULARIZE=1 -o js-with-glue.js
```

Alternatively, you can run the following command:
```
make js-with-glue
```

Run the following command within this folder:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/js-with-glue.html` and compare to book.

## Interaction without Glue Code
Run the following command within this folder:
```
emcc js-without-glue.cpp -Os -s WASM=1 -s SIDE_MODULE=1 \
-s BINARYEN_ASYNC_COMPILATION=0 -o js-without-glue.wasm
```

Alternatively, you can run the following command:
```
make js-without-glue
```

Run the following command within the **root** folder:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/chapter-06-interact-with-js/js-without-glue.html` and compare to book.

## Using Source Maps
Run the following command within the **root** folder:
```
emcc chapter-06-interact-with-js/js-without-glue.cpp -O1 -g4 \
-s WASM=1 -s SIDE_MODULE=1 -s BINARYEN_ASYNC_COMPILATION=0 \
-o chapter-06-interact-with-js/js-without-glue.wasm \
--source-map-base http://localhost:8080/chapter-06-interact-with-js/
```

Alternatively, you can run the following command:
```
make try-with-glue
```

Run the following command within the **root** folder:
```
serve -l 8080
```

Navigate to `http://127.0.0.1:8080/chapter-06-interact-with-js/js-without-glue.html` and compare to book.

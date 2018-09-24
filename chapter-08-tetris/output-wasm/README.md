# Chapter 8: Porting a Game with Emscripten (Ported Code)

## Overview
The code within this folders represents ported codebase reviewed in Chapter 8.

## Notes
- Unless otherwise specified, all terminal commands should be run from within this folder.
- To remove existing built files, run the following command:
```
make clean
```

## Prerequisites
- Emscripten (emsdk)

## Compiling the Application
Run the following command within this folder:
```
make
```

## Running the Application
Run the following command within this folder:
```
emrun --browser chrome --no_emrun_detect public/index.html
```

If you navigate to `http://localhost:6931/index.html`, you should be able to play the game.


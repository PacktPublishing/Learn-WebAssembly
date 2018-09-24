# Chapter 8: Porting a Game with Emscripten (Pre-Ported Code)

## Overview
The code within this folders represents the pre-ported (native) codebase reviewed in Chapter 8.

## Notes
- Unless otherwise specified, all terminal commands should be run from within this folder.

## Prequisites (All Platforms)
- GNU Make >= v3.81
- CMake >= v3.5

## macOS Instructions
### Prerequisites
- SDL2
- SDL2_ttf

### Building and Running the Game
1. Run the following command from within this folder to configure CMake:
```
cmake ./ -Bbuild
```

2. Once the CMake configuration is complete, run the following command to build the game:
```
cd build && make
```

3. Run the following command to start the game:
```
./Tetris
```

## Ubuntu Instructions
### Prerequisites
- libsdl2-dev
- libsdl2-ttf-dev

### Building and Running the Game
1. Run the following command from within this folder to configure CMake:
```
cmake ./ -Bbuild
```

2. Once the CMake configuration is complete, run the following command to build the game:
```
cd build && make
```

3. Run the following command to start the game:
```
./Tetris
```

## Windows Instructions
### Prerequisites
- Visual Studio

### Building and Running the Game
- Instructions pending

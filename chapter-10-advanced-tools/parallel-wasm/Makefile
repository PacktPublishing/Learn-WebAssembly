.DEFAULT_GOAL := build

LIB_DIR = lib
SRC_DIR = src
FLAGS = -Os -s WASM=1 -s SIDE_MODULE=1 -s BINARYEN_ASYNC_COMPILATION=0

clean:
	rimraf $(SRC_DIR)/*.wasm

compile:
	emcc $(FLAGS) $(LIB_DIR)/add.c -o $(SRC_DIR)/calc-add.wasm
	emcc $(FLAGS) $(LIB_DIR)/subtract.c -o $(SRC_DIR)/calc-subtract.wasm

build: clean compile

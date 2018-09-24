.DEFAULT_GOAL := build

OUTPUT_FILE = src/assets/main.wasm

clean:
	rimraf $(OUTPUT_FILE)

compile:
	emcc lib/main.c -Os -s WASM=1 -s SIDE_MODULE=1 \
	-s BINARYEN_ASYNC_COMPILATION=0 -o $(OUTPUT_FILE)

build: clean compile

.DEFAULT_GOAL := build

OUTPUT_FILE = main.wasm

clean:
	rimraf $(OUTPUT_FILE)

compile:
	wa compile main.cpp -o $(OUTPUT_FILE)

build: clean compile
